import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chainType } from "ChainType";
import MiniHeader from "../../components/miniHeader/MiniHeader";
import PassCodeInput from "./PassCodeInput";
import { useGetPrivateKey } from "../../hook/useGetPrivateKey";
import CheckPrivateKey from "./CheckPrivateKey";
import './index.scss';

function WalletPrivateKey() {
    const { chainType } = useParams();
    const { passCode, setPassCode, validPassCode, getPrivateKey } = useGetPrivateKey();
    const [pageMode, setPageMode] = useState('PASSCODE_INPUT');
    const [privateKey, setPrivateKey] = useState('');

    const getPrivateKeyHandler = async () => {
        const _privateKey = await getPrivateKey(chainType as chainType);
        setPrivateKey(_privateKey);
        goToPrivateKeyCheckPage();
    }

    const goToPrivateKeyCheckPage = () => {
        setPageMode('CHECK_PRIVATE_KEY');
    }

    const pageRenderer = () => {
        switch(pageMode) {
            case 'PASSCODE_INPUT':
                return <PassCodeInput 
                    passCode={passCode}
                    setPassCode={setPassCode}
                    validPassCode={validPassCode}
                    submitAction={()=>{getPrivateKeyHandler()}}
                />
            
            case 'CHECK_PRIVATE_KEY':
                return <CheckPrivateKey 
                    privateKey={privateKey}
                />
        }
    }

    useEffect(()=>{
        const chainTypeType = chainType as chainType;
        console.log(typeof chainTypeType);
        if (typeof chainType !== chainType) {
            // navigation(-1);
        }
    }, [chainType])

    return (
        <div className="wallet-privatekey-page">
            <MiniHeader 
                title="프라이빗키 확인하기"
            />
            { pageRenderer() }
        </div>
    )
}
export default WalletPrivateKey;