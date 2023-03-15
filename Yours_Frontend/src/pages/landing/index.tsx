import { useEffect, useState } from 'react';
import logo from '../../asset/svg/icon.svg';
import background01 from '../../asset/image/landing/background01.png';
import background02 from '../../asset/image/landing/background02.png';
import background03 from '../../asset/image/landing/background03.png';
import background04 from '../../asset/image/landing/background04.png';
import block01 from '../../asset/image/landing/block01.png';
import block02 from '../../asset/image/landing/block02.png';
import block03 from '../../asset/image/landing/block03.png';
import block04 from '../../asset/image/landing/block04.png';
import './index.scss';

function Landing() {
    const blockImgList = [block01, block02, block03, block04];
    const pageInfoList = [
        { background: background01, img: undefined, title: '내가 가진 NFT 혜택을\n가장 쉽게 꺼내봐요', description: 'Yours가 혜택을 모아서\n카카오톡 플러스 친구로 보내드릴게요', lang: 'kor' },
        { background: background02, img: undefined, title: '블록체인 지갑 없이도\nNFT 혜택을 누려요', description: '언제든지 사용자가 원할 때\n블록체인 지갑으로 NFT를 옮겨갈 수 있어요', lang: 'kor' },
        { background: background03, img: undefined, title: '누구나 쉽게 발행할 수 있어요', description: 'NFT 이름, 이미지, 개수를 입력하면 발행 완료!', lang: 'kor' },
        { background: background04, img: logo, title: 'It\' Sincerely\nYours', description: 'Easily record the information\nyou want to record in NFT', lang: 'eng' },
    ]
    const [currPage, setCurrPage] = useState(0);

    const kakaoLogin = () => {
        let redirectUrl = `${window.location.origin}/oauth`
        window.location.href=`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_KAKAO_API_KEY}&redirect_uri=${redirectUrl}`;
    }

    const touchStartHandler = (e:any) => {
        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;
        const landingPage = document.getElementById('landing-page');

        landingPage?.addEventListener('touchend', (e:any)=>{
            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const diffX = endX - startX;
            const diffY = endY - startY;
            if(Math.abs(diffX) > Math.abs(diffY)) {
                if(diffX > 0) {
                    if(currPage === 0) {
                        setCurrPage(0);
                    } else {
                        setCurrPage(currPage-1);
                    }
                } else {
                    if(currPage === pageInfoList.length-1) {
                        setCurrPage(pageInfoList.length-1);
                    } else {
                        setCurrPage(currPage+1);
                    }
                }
            }
        })
    }

    const mouseDownHandler = (e:any) => {
        const startX = e.clientX;
        const startY = e.clientY;
        const landingPage = document.getElementById('landing-page');

        landingPage?.addEventListener('mouseup', (e:any)=>{
            const endX = e.clientX;
            const endY = e.clientY;
            const diffX = endX - startX;
            const diffY = endY - startY;
            if(Math.abs(diffX) > Math.abs(diffY)) {
                if(diffX > 0) {
                    if(currPage === 0) {
                        setCurrPage(0);
                    } else {
                        setCurrPage(currPage-1);
                    }
                } else {
                    if(currPage === pageInfoList.length-1) {
                        setCurrPage(pageInfoList.length-1);
                    } else {
                        setCurrPage(currPage+1);
                    }
                }
            }
        })
    }

    useEffect(()=>{
        let navbar = document.getElementById('navbar');
        navbar?.classList.add('navbar--transparent');

        let appContent = document.getElementById('app-content');
        appContent?.classList.add('app-content--none');

        return () => {
            navbar?.classList.remove('navbar--transparent');
            appContent?.classList.remove('app-content--none');
        }
    }, [])
    

    return (
        <div 
            className="landing" 
            id="landing-page"
            onTouchStart={(e:any)=>{touchStartHandler(e)}}
            onMouseDown={(e:any)=>{mouseDownHandler(e)}}
        >
            <div className="page-wrapper">
                {
                    pageInfoList.map((page, idx)=>(
                        <div className="page" id={currPage===idx ? 'curr-page' : ''} key={idx}/>
                    ))
                }
            </div>
            <div
                className="landing-page-wrapper"
                id={`landing-page--${currPage+1}`}
                style={{backgroundImage: `url(${pageInfoList[currPage].background})`}}
            >   
                {
                    pageInfoList[currPage].img && <img src={pageInfoList[currPage].img} className="landing-page-img"/>
                }
                <h1 className={pageInfoList[currPage].lang}>{ pageInfoList[currPage].title }</h1>
                <h4 className={pageInfoList[currPage].lang}>{ pageInfoList[currPage].description }</h4>
                <div className="block-wrapper">
                    {
                        blockImgList.map((block, idx)=>(
                            <img src={block} className="block" id={`block0${idx+1}`} key={idx}/>
                        ))
                    }
                </div>
            </div>
            <button className="button" onClick={()=>{kakaoLogin()}}>
                카카오 계정으로 시작하기
            </button>
        </div>
    )
}
export default Landing;