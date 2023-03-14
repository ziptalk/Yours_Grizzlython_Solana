import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NFTApi from "../../apis/NftApi";
import CheckBadgeInfo from "./CheckBadgeInfo";
import SetBadgeCertification from "./certification/index";
import SetBadgeInfo from "./SetBadgeInfo";
import Success from "../../components/success/Success";
import './index.scss';
import chainList from "../../utils/data/chainList";

function CreateNft() {
    const nftApi = new NFTApi();
    const navigation = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [badgeName, setBadgeName] = useState("");
    const [badgeImgUrl, setBadgeImgUrl] = useState("");
    const [badgeImgFormData, setBadgeImgFormData] = useState(new FormData());
    const [badgeDescription, setBadgeDescription] = useState("");
    const [nftChain, setNftChain] = useState("");
    const [badgeId, setBadgeId] = useState<number>();
    const [authMode, setAuthMode] = useState<number>(0);
    const [option, setOption] = useState<string>("");

    useEffect(()=>{
        let _pageMode = searchParams.get("pageMode");
        if (_pageMode !== "SET_BADGE_INFO" && _pageMode !== "CHECK_BADGE_INFO" && _pageMode !== "SET_BADGE_CERTIFICATION" && _pageMode !== "CREATE_BADGE_SUCCESS") {
            goToSetBadgeInfo();
        }
        window.scrollTo(0,0);
    }, [searchParams])

    const makeNFTBadge = async () => {
        let newBadgeFormdata = badgeImgFormData;
        newBadgeFormdata.append('nftName', badgeName);
        newBadgeFormdata.append('description', badgeDescription);
        newBadgeFormdata.append('authType', authMode?.toString());
        newBadgeFormdata.append('options', option);
        newBadgeFormdata.append('chainType', nftChain);
        const res = await nftApi.createNft(newBadgeFormdata);
        await setBadgeId(res.data.id);
        
        goToCreateBadgeSuccess();
    }

    const goToSetBadgeInfo = (_page:number = 1) => { setSearchParams({ pageMode: "SET_BADGE_INFO", page: String(_page) }) }
    const goToCheckBadgeInfo = () => { setSearchParams({ pageMode: "CHECK_BADGE_INFO" }) }
    const goToSetBadgeCertification = () => { setSearchParams({ pageMode: "SET_BADGE_CERTIFICATION"}) }
    const goToCreateBadgeSuccess = () => { setSearchParams({ pageMode: "CREATE_BADGE_SUCCESS" }) }

    const preventToClose = (e:any) => {
        e.preventDefault();
        e.returnValue = '';
    }

    const resetPageMode = (e:any) => {
        window.location.href = '/nft/create';
    }

    useEffect(()=>{
        window.addEventListener('beforeunload', preventToClose);
        window.addEventListener('unload', resetPageMode);
        return () => {
            window.removeEventListener('beforeunload', preventToClose);
            window.removeEventListener('unload', resetPageMode);
        }
    }, [])

    return (
        <form className="create-badge" autoComplete="off" onSubmit={(e)=>e.preventDefault()}>
            {
                !!(searchParams.get("pageMode") === "SET_BADGE_INFO") &&
                <SetBadgeInfo 
                    badgeName={badgeName}
                    setBadgeName={setBadgeName}
                    badgeImgUrl={badgeImgUrl}
                    setBadgeImgUrl={setBadgeImgUrl}
                    setBadgeImgFormData={setBadgeImgFormData}
                    badgeDescription={badgeDescription}
                    setBadgeDescription={setBadgeDescription}
                    nftChain={nftChain}
                    setNftChain={setNftChain}
                    next={goToCheckBadgeInfo}
                />
            }
            {
                !!(searchParams.get("pageMode") === "CHECK_BADGE_INFO") &&
                <CheckBadgeInfo 
                    badgeInfo={
                        { 
                            name: badgeName,
                            image: badgeImgUrl,
                            description: badgeDescription,
                        }
                    }
                    chainInfo={chainList.find(el=>el.name===nftChain)}
                    prev={()=>goToSetBadgeInfo(4)}
                    next={goToSetBadgeCertification}
                />
            }
            {
                !!(searchParams.get("pageMode") === "SET_BADGE_CERTIFICATION") &&
                <SetBadgeCertification 
                    makeNFTBadge={makeNFTBadge}
                    option={option}
                    setOption={setOption}
                    setAuthMode={setAuthMode}
                />
            }
            {
                !!(searchParams.get("pageMode") === "CREATE_BADGE_SUCCESS") &&
                <Success 
                    image={badgeImgUrl}
                    title={<><b>{badgeName}</b> 인증 NFT<br />생성 완료!</>}
                    buttonText={"생성된 NFT 상세 페이지 가기"}
                    buttonAction={()=>{navigation(`/nft/${badgeId}/detail`)}}
                />
            }
        </form>
    )
}
export default CreateNft;