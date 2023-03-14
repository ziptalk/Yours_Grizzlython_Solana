import { ACTION_TYPES } from "./nftTypes";

export const setOwnNftIdList = (nftList : number[]) => {
    return {type: ACTION_TYPES.SET_OWN_NFT_LIST, data: nftList};
}

export const setCreateNftIdList = (nftList : number[]) => {
    return {type: ACTION_TYPES.SET_CREATE_NFT_LIST, data: nftList};
}

export const setTransferNftIdList = (nftList : number[]) => {
    return {type: ACTION_TYPES.SET_TRANSFER_NFT_LIST, data: nftList};
}

export const setIntegratedNftList = (nftList : any[]) => {
    return {type: ACTION_TYPES.SET_INTEGRATED_NFT_LIST, data: nftList};
}

export const addOwnNft = (badgeId : number) => {
    return {type: ACTION_TYPES.ADD_OWN_NFT, data: badgeId};
}

export const addCreateNft = (badgeId : number) => {
    return {type: ACTION_TYPES.ADD_CREATE_NFT, data: badgeId};
}

export const addTransferNft = (badgeId : number) => {
    return {type: ACTION_TYPES.ADD_TRANSFER_NFT, data: badgeId};
}

export const addIntegratedNft = (nftInfo : any) => {
    return {type: ACTION_TYPES.ADD_INTEGRATED_NFT, data: nftInfo};
}