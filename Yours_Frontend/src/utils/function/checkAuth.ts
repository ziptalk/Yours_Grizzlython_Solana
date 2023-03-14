import NFTApi from "../../apis/NftApi";
import UserApi from "../../apis/UserApi";
import store from "../../redux/store"
import { setAuth } from "../../redux/userData/userDataAction"

const userApi = new UserApi();
const nftApi = new NFTApi();

export const checkAuth = async () => {
    try {
        await userApi.getSetUserInfo();
        await userApi.getWallets();
        await nftApi.getUserOwnNftIdList();
        await nftApi.getUserCreateNftIdList();
        await nftApi.getUserTransferNftIdList();
        await nftApi.getUserIntegratedNftList();
    } catch(err) {
        store.dispatch(setAuth(false));
    }
}