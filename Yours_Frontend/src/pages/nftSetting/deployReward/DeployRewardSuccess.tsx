import { NftInfo } from "NftType";
import { useNavigate } from "react-router-dom";
import chainList from '../../../utils/data/chainList';
import Success from "../../../components/success/Success";

type deoploySuccessProp = {
    nftInfo: NftInfo;
    deployInfo: any;
}

function DeoployRewardSuccess({ nftInfo, deployInfo }:deoploySuccessProp) {
    const navigation = useNavigate();

    return (
        <Success
            image={nftInfo.image}
            title={<><b>{ nftInfo.nftName }</b> NFT가<br/>업데이트 되었어요!</>}
            buttonText="상세 페이지에서 확인하기"
            buttonAction={()=>{navigation(`/nft/${nftInfo.id}/detail`)}}
        >
            <div className="deploy-info-container flex-column-20">
                <h2 className="deploy-info-title eng">Info</h2>
                <div className="deploy-info-row">
                    <h6 className="title gr-4">TX</h6>
                    <h6 
                        className="content underline"
                        onClick={()=>{window.location.href=`${chainList.find(el=>el.name===nftInfo.chainType)?.explorerUrl}/${deployInfo.deployInfo}`}}
                    >
                        View TX
                    </h6>
                </div>
                <div className="deploy-info-row">
                    <h6 className="title">Status</h6>
                    <h6 className="content">Success</h6>
                </div>
                <div className="deploy-info-row">
                    <h6 className="title">Date</h6>
                    <h6 className="content">{ deployInfo?.date.replace('T', ' ') }</h6>
                </div>
            </div>
        </Success>
    )
}
export default DeoployRewardSuccess;