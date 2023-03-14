import { useEffect, useState } from "react";
import Web3 from 'web3';

type trasferInputType = {
    nftImage:string;
    nftName:string;
    transferNft:Function;
}

function TransferInput({ nftImage, nftName, transferNft }:trasferInputType) {
    const [walletAddress, setWalletAddress] = useState('');
    const [validAddress, setValidAddress] = useState(false);

    useEffect(()=>{
        try {
            Web3.utils.toChecksumAddress(walletAddress);
            setValidAddress(true);
        } catch(err) {
            setValidAddress(false);
        }

    }, [walletAddress])

    return (
        <form onSubmit={(e)=>{e.preventDefault(); transferNft(walletAddress)}}>
            <div className="title-wrapper">
                <h2 className="title">어디로 이 NFT를 옮겨갈까요?</h2>
                <h5 className="subtitle">
                    <span className="white">메타마스크 지갑을 가지고 있을 경우</span> NFT를 지갑으로 옮겨갈 수 있어요. 지갑으로 전송한 이후에도 <span className="white">마이페이지</span>에서 확인할 수 있습니다.
                </h5>
            </div>
        
            <img 
                className="nft-image"
                src={nftImage}
            />
            <div className="input-box-wrapper">
                <label className="input-label">메타마스크(Metamask) 지갑 주소</label>
                <input 
                    className="input-textbox"
                    value={walletAddress}
                    placeholder="Ex. 0xB5D... (ENS 주소는 지원되지 않습니다)"
                    onChange={(e)=>{setWalletAddress(e.currentTarget.value)}}
                />
                {
                    !!(walletAddress.length) &&
                    (
                        !validAddress &&
                        <div className="input-status" id="warning">
                            유효하지 않은 주소입니다.
                        </div>
                    )
                }
            </div>

            <div className="transfer-preview">
                <b>{ nftName }</b> 이<br/>
                {
                    walletAddress.length
                    ? <span className="transfer-wallet-address">
                        { walletAddress }
                    </span>
                    : '...'
                }
                <br/>주소로 전송됩니다.
            </div>
            <div className="transfer-warning">
                잘못된 주소로 전달 되었을 때 복구가 불가능합니다.<br/>
                주소를 다시 한 번 확인해주세요.
            </div>
            
            <button
                className="button button--sticky"
                id="purple"
                disabled={!validAddress}
            >
                전송하기
            </button>
        </form>
    )
}
export default TransferInput;