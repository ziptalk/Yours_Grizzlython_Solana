import { useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/footer';
import Navbar from './components/navbar';
import Oauth from './pages/oauth/Oauth';
import Landing from './pages/landing';
import Signup from './pages/signup';
import Mypage from './pages/mypage';
import { checkAuth } from './utils/function/checkAuth';
import NftDetail from './pages/nftDetail';
import PrivateOutlet from './router/PrivateOutlet';
import CreateNft from './pages/nftCreate';
import ScrollToTop from './utils/ScrollToTop';
import { useSelector } from 'react-redux';
import NotFound from './pages/error/NotFound';
import GetNft from './pages/getNft';
import GetNftSuccess from './pages/getNftSuccess';
import NftEmailVerify from './pages/nftEmailVerify';
import NftAdmin from './pages/nftAdmin';
import NftTransfer from './pages/nftTransfer';
import Alert from './components/alert/Alert';
import NftSetting from './pages/nftSetting';
import NftRewardSetting from './pages/nftSetting/reward';
import AddReward from './pages/nftSetting/reward/AddReward';
import RewardDetail from './pages/nftSetting/reward/RewardDetail';
import RewardEdit from './pages/nftSetting/reward/RewardEdit';
import NftOwnerOutlet from './router/NftOwnerOutlet';
import EditProfile from './pages/editProfile';
import CreateIntegratedNft from './pages/createIntegratedNft';
import Success from './pages/createIntegratedNft/success';
import IntegratedNftDetail from './pages/integratedNftDetail';
import IntegratedNftAdmin from './pages/integratedNftAdmin';
import WalletTutorial from './pages/walletTutorial';
import WalletTutorialSecret from './pages/walletTutorialSecret';
import NftDeploy from './pages/nftSetting/deploy';
import NftDeployReward from './pages/nftSetting/deployReward';
import YoursWallet from './pages/wallet';
import WalletPrivacy from './pages/walletPrivacy';
import WalletPrivacyCheckMnemonic from './pages/walletPrivacyCheckMnemonic';
import WalletPrivacyChangePassCode from './pages/walletPrivacyChangePasscode';
import WalletPrivacyResetPassCode from './pages/walletPrivacyResetPassCode';
import WalletPrivateKey from './pages/walletPrivateKey';

function App() {
  const auth = useSelector((state:any)=>state.userData.auth);

  useLayoutEffect(()=>{
    checkAuth();
  }, [])

  return (
    <div className="App" id="app">
      <BrowserRouter>
        <Navbar />
        <Alert />
        <ScrollToTop />
        <div className="app-content" id="app-content">
        <Routes>
            {/* Public Outlet */}
            <Route path="/landing" element={<Landing />}/>
            <Route path="/oauth" element={<Oauth />}/>
            <Route path="/signup" element={<Signup />}/>
            <Route path="/nft/:nftId/detail" element={<NftDetail />}/>
            <Route path="/nft/email" element={<NftEmailVerify />}/>
            <Route path="/integrated-nft/:nftId" element={<IntegratedNftDetail />}/>
            
            {/* Private Outlet */}
            <Route element={<PrivateOutlet />}>
              <Route path="/mypage" element={<Mypage />}/>
              <Route path="/profile/edit" element={<EditProfile />}/>

              {/* nft 관련 */}
              <Route path="/nft">
                <Route path="create" element={<CreateNft />}/>
                <Route path=":nftId">
                  <Route path="get" element={<GetNft />}/>
                  <Route path="get/success" element={<GetNftSuccess />}/>
                  <Route path="transfer" element={<NftTransfer />}/>
                </Route>
              </Route>

              {/* 통합 nft 관련 */}
              <Route path="/integrated-nft">
                <Route path="create">
                  <Route index element={<CreateIntegratedNft />} />
                  <Route path=":integratedNftInfo" element={<Success />}/>
                </Route>
                <Route path=":nftId">
                  <Route path="admin" element={<IntegratedNftAdmin />}/>
                </Route>
              </Route>
            </Route>

            {/* wallet 관련 */}
            <Route path="/wallet">
              <Route index element={<YoursWallet />} />
              <Route path="privacy">
                <Route index element={<WalletPrivacy />} />
                <Route path="mnemonic" element={<WalletPrivacyCheckMnemonic />} />
                <Route path="passcode" element={<WalletPrivacyChangePassCode />} />
                <Route path="passcode/reset" element={<WalletPrivacyResetPassCode />} />
              </Route>
              <Route path="privatekey/:chainType" element={<WalletPrivateKey />} />
              <Route path="tutorial">
                <Route index element={<WalletTutorial />}/>
                <Route path="secret" element={<WalletTutorialSecret />}/>
              </Route>
            </Route>

            {/* Nft Owner만 접근할 수 있는 페이지 */}
            <Route path="/nft/:nftId/setting" element={<NftOwnerOutlet />}>
              <Route index element={<NftSetting />}/>
              <Route path="admin" element={<NftAdmin />}/>
              <Route path="deploy" element={<NftDeploy />}/>
              <Route path="deploy/reward" element={<NftDeployReward />}/>
              <Route path="reward">
                <Route index element={<NftRewardSetting />}/>
                <Route path="add" element={<AddReward />} />
                <Route path=":rewardId" element={<RewardDetail />}/>
                <Route path=":rewardId/edit" element={<RewardEdit />} />
              </Route>
            </Route>

            {/* 기본 페이지 */}
            <Route path="/" element={auth ? <Navigate to="/mypage"/> : <Navigate to="/landing"/>}/>

            {/* 404 페이지 처리 */}
            <Route path="/error" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/error"/>} />
        </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
