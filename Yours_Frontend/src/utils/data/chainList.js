import EthereumLogo from "../../asset/image/chain/Ethereum.png";
import KlaytnLogo from "../../asset/image/chain/Klaytn.png";
import PolygonLogo from "../../asset/image/chain/Polygon.png";
import SolanaLogo from "../../asset/image/chain/Solana.png";
import AptosLogo from "../../asset/image/chain/Aptos.png";
import { ReactComponent as EthereumIcon } from "../../asset/svg/chain/ethereum.svg";
import { ReactComponent as KlaytnIcon } from "../../asset/svg/chain/klaytn.svg";
import { ReactComponent as PolygonIcon } from "../../asset/svg/chain/polygon.svg";
import { ReactComponent as SolanaIcon } from "../../asset/svg/chain/solana.svg";
import { ReactComponent as AptosIcon } from "../../asset/svg/chain/aptos.svg";

const chainList = [
    { name: "Ethereum", logo: EthereumLogo, icon: <EthereumIcon/>, explorerUrl: 'https://goerli.etherscan.io/tx' },
    { name: "Klaytn", logo: KlaytnLogo, icon: <KlaytnIcon/>, explorerUrl: 'https://baobab.scope.klaytn.com/tx' },
    { name: "Polygon", logo: PolygonLogo, icon: <PolygonIcon/>, explorerUrl: 'https://polygonscan.com/tx' },
    { name: "Solana", logo: SolanaLogo, icon: <SolanaIcon/>, explorerUrl: 'https://goerli.etherscan.io/tx' },
    { name: "Aptos", logo: AptosLogo, icon: <AptosIcon/>, explorerUrl: 'https://goerli.etherscan.io/tx' },
]
export default chainList;