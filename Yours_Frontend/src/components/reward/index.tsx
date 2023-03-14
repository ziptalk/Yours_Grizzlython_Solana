import { useNavigate } from 'react-router-dom';
import './index.scss';

type rewardElemProp = {
    nftName: string,
    nftId: number,
    reward: rewardType
}

type rewardType = {
    rewardName: string,
    id: number
}

function RewardElem({ nftName, nftId, reward }:rewardElemProp) {
    const navigation = useNavigate();

    return (
        <div className="nft-reward-elem-wrapper">
            <div className="nft-reward-info-wrapper">
                <div 
                    className="nft-name"
                    onClick={()=>{(navigation(`/nft/${nftId}/detail`))}}
                >
                    { nftName }
                </div>
                <div className="reward-name">{ reward.rewardName }</div>
            </div>
            <button className="nft-reward-action-button" disabled={true}>
                준비중
            </button>
        </div>
    )
}
export default RewardElem;