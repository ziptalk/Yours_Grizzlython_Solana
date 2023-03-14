import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { generateRandomMnemonic, generateWalletsFromMnemonic } from "../../utils/function/wallet";
import { encryptMnemonic } from "../../utils/function/crypto";
import { usePassCode } from "../../hook/usePassCodeInput";
import axios from "axios";
import UserApi from "../../apis/UserApi";
import InputForm from "./InputForm";
import PassCodeInput from "../../components/passCode/PassCodeInput";
import PassCodeConfirm from "../../components/passCode/PassCodeConfirm";
import { ReactComponent as ArrowLeft } from '../../asset/svg/arrow-left.svg';
import './index.scss';


function Signup() {
    const [searchParams, setSearchParams] = useSearchParams();
    const userApi = new UserApi();
    const navigation = useNavigate();
    const { passCode, setPassCode, isValid } = usePassCode();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [nickname, setNickname] = useState('');
    const [agreeToTermList, setAgreeToTermList] = useState<String[]>([]);
    const [snsId, setSnsId] = useState<string>();
    const [profileImage, setProfileImage] = useState();
    const [email, setEmail] = useState();

    const [pageMode, setPageMode] = useState('PASSCODE');

    useEffect(()=>{
        // page mode 설정하기
        setPageMode(searchParams.get('pageMode') || 'INPUT');
    }, [searchParams])

    const goToInput = () => { setSearchParams({...searchParams, pageMode: 'INPUT'}) }
    const goToPassCode = () => { setSearchParams({...searchParams, pageMode: 'PASSCODE'}) }
    const goToConfirmPassCode = () => { setSearchParams({...searchParams, pageMode: 'CONFIRM_PASSCODE'}) }

    const generateWallets = () => {
        const mnemonic = generateRandomMnemonic();
        const wallets:any = generateWalletsFromMnemonic(mnemonic);
        const addressList = [];
        
        for (let chain in wallets) {
            addressList.push({ chainType: chain, address: wallets[chain].address });
        }

        const secret = encryptMnemonic(mnemonic, passCode);

        return { addressList, secret };
    }

    const signup = async () => {
        const wallets = generateWallets();

        const newUserData = {
            snsId: snsId,
            nickname: nickname,
            profileImage: profileImage,
            email: email,
            phone: phoneNumber.split('-').join(''),
            social: 'KAKAO',
            isMarketing: agreeToTermList.includes('MARKETING'),
            walletAddress: wallets.addressList,
            secret: wallets.secret
        }

        const res = await userApi.signup(newUserData);
        // 회원가입 성공 후 마이페이지로 이동
        navigation('/mypage', { state: { newUser: true } });
    }

    const pageRenderer = () => {
        switch(pageMode) {
            case 'INPUT':
                return <InputForm 
                    setPhoneNumber={setPhoneNumber}
                    nickname={nickname}
                    setNickname={setNickname}
                    agreeToTermList={agreeToTermList}
                    setAgreeToTermList={setAgreeToTermList}
                    goToNextPage={goToPassCode}
                />
            case 'PASSCODE':
                return <PassCodeInput 
                    title="패스코드 설정"
                    description={"추후 Yours Wallet 안에 들어있는 자산을 거래하거나\n이동하기 위해서는 패스코드를 입력해야 합니다."}
                    passCode={passCode}
                    setPassCode={setPassCode}
                    isValid={isValid}
                    buttonText="다음"
                    buttonAction={goToConfirmPassCode}
                />
            case 'CONFIRM_PASSCODE':
                return <PassCodeConfirm 
                    passCode={passCode}
                    confirmText="시작하기"
                    confirmAction={signup}
                />
            default:
        }
    }

    useEffect(()=>{
        const getKakaoInfo = async () => {
            // kakao sns id, profile image, email 받아오기
            const kakaoToken = new URLSearchParams(window.location.search).get('kakao');
            try {
                const kakaoInfo = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
                    headers: {
                      Authorization: `Bearer ${kakaoToken}`
                    }
                })
                setSnsId(kakaoInfo.data.id.toString());
                setProfileImage(kakaoInfo.data.properties.profile_image);
                setEmail(kakaoInfo.data.kakao_account.email);
            } catch(err) {
                // kakao token이 잘못되었을 시 landing 페이지로 가도록 -> 유효한 카카오 로그인을 통해서만 회원가입 가능하도록
                console.log(err);
                navigation(-1);
            }
        }
        getKakaoInfo();
    }, [])

    const preventToClose = (e:any) => {
        e.preventDefault();
        e.returnValue = '';
    }

    useEffect(()=>{
        window.addEventListener('beforeunload', preventToClose);
        return () => window.removeEventListener('beforeunload', preventToClose);
    }, [])

    return (
        <div className="signup">
            <div className="signup-header">
                <ArrowLeft 
                    className="go-back"
                    onClick={()=>navigation('/landing')}
                />
                <h3>회원가입</h3>
            </div>
            { pageRenderer() }
        </div>
    )
}
export default Signup;