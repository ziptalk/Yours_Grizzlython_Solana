import { useState, useEffect } from "react";
import NFTApi from "../apis/NftApi";

type useIntegratedNftProp = {
    integratedNftId: number;
}

const tempIntegratedNftInfo = {
    id: 1,
    chainType: "Ethereum",
    createdAt: '2023-02-22T00:00:00:00',
    userName: 'user1',
    nftArray: [
        { nftId: 1, nftName: "NFT1", nftImage: "https://picsum.photos/200/300" },
        { nftId: 2, nftName: "NFT2", nftImage: "https://picsum.photos/200/300" },
        { nftId: 3, nftName: "NFT3", nftImage: "https://picsum.photos/200/300" },
    ],
    rewardArray: [
        { nftId: 1, nftName: "NFT1", rewardId: 1, rewardName: "Reward1", rewardImage: "https://picsum.photos/200/300" },
        { nftId: 1, nftName: "NFT1", rewardId: 2, rewardName: "Reward2", rewardImage: "https://picsum.photos/200/300" },
        { nftId: 1, nftName: "NFT1", rewardId: 3, rewardName: "Reward3", rewardImage: "https://picsum.photos/200/300" },
    ]
}

export const useIntegratedNft = ({ integratedNftId }:useIntegratedNftProp) => {
    const nftApi = new NFTApi();
    const [integratedNftInfo, setIntegratedNftInfo] = useState<any>(null);

    useEffect(()=>{
        const getIntegratedNftInfo = async () => {
            const res = await nftApi.getIntegratedNftDetail(integratedNftId);
            setIntegratedNftInfo(res);
        }

        getIntegratedNftInfo();
    }, [integratedNftId])

    return { integratedNftInfo };
}