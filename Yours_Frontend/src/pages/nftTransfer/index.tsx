
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNft } from "../../hook/useNft";
import { setShowAlertInfo } from "../../utils/function/showAlert";
import chainList from "../../utils/data/chainList";
import NFTApi from "../../apis/NftApi";
import MiniHeader from "../../components/miniHeader/MiniHeader";
import TransferInput from "./TrasferInput";
import TransferLoading from "./TransferLoading";
import TransferComplete from "./TransferComplete";
import './index.scss';

type transferStatusType = 'INPUT'|'LOADING'|'COMPLETE';

function NftTransfer() {
    const nftApi = new NFTApi();
    const { nftId } = useParams();
    const { nftInfo } = useNft({ nftId: Number(nftId) });
    const [transferStatus, setTransferStatus] = useState<transferStatusType>('INPUT');
    const [txId, setTxId] = useState('');

    useEffect(()=>{
        window.scrollTo(0,0);
    }, [transferStatus])

    /**
     * @description transferStatus에 따라 다른 컴포넌트를 렌더링합니다.
     * @returns JSX.Element
     */
    const renderTransferComponent = () => {
        switch(transferStatus) {
            case 'INPUT':
                return <TransferInput
                    nftImage={nftInfo?.image}
                    nftName={nftInfo?.nftName}
                    transferNft={transferNft}
                />;
            case 'LOADING':
                return <TransferLoading
                    nftName={nftInfo?.nftName}
                />
            case 'COMPLETE':
                return <TransferComplete 
                    nftName={nftInfo?.nftName}
                    transactionExplorerUrl={chainList.find(el=>el.name===nftInfo?.chainType)?.explorerUrl}
                    transactionId={txId}
                /> 
        }
    }

    const transferNft = async (address:string) => {
        setTransferStatus('LOADING');
        try {
            const res = await nftApi.transferNft(Number(nftId), address);
            setTxId(res);
            setTransferStatus('COMPLETE');
        } catch(err) {
            setShowAlertInfo('NFT 전송에 실패했습니다.\n다시 시도해주세요.', false);
            setTransferStatus('INPUT');
        }
    }

    return (
        <div className="nft-transfer">
            <MiniHeader
                title="Transfer"
            />
            { renderTransferComponent() }
        </div>
    )
}
export default NftTransfer;