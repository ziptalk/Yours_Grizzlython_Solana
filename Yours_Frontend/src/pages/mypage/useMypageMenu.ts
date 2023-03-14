import { useEffect, useState } from 'react';
import NFTApi from '../../apis/NftApi';

type nftGetType = 'create'|'own'|'reward';

type menuDataListType = {
    type: 'create'|'own'|'reward',
    title: string,
    data: any[],
    contentLength: number
}

const useMypageMenu = () => {
    const nftApi = new NFTApi();
    const menuInfoList = [
        { type: 'own', title: '보유한 NFT' },
        { type: 'reward', title: '보유한 혜택' },
        { type: 'create', title: '생성한 NFT' },
    ]
    const [currMenu, setCurrMenu] = useState<nftGetType>('own' as nftGetType);
    const [menuDataList, setMenuDataList] = useState<menuDataListType[]>();
    const [searchWord, setSearchWord] = useState<string>('');
    const [searchData, setSearchData] = useState<any[]>([]);

    useEffect(()=>{ // 메뉴 바뀔 때마다 검색어 초기화
        setSearchWord('');
    }, [currMenu])

    useEffect(()=>{
        const getMenuInfoList = async () => {
            let tempMenuInfo = [];
            for (let menu of menuInfoList) {
                const res = await nftApi.getMypageNftList(menu.type);
                
                let newMenuInfo = {
                    type: menu.type as nftGetType,
                    title: menu.title,
                    data: res,
                    contentLength: res.length
                }
                tempMenuInfo.push(newMenuInfo);
            }
            setMenuDataList(tempMenuInfo);
        }
        getMenuInfoList();
    }, [])

    useEffect(()=>{
        if (searchWord.length) {
            const getSearchResult = async () => {
                const res = await nftApi.getMypageNftSearch(currMenu as String, searchWord);
                setSearchData(res.data);
            }
            getSearchResult();
        }
    }, [searchWord])

    return { menuDataList, currMenu, setCurrMenu, searchWord, setSearchWord, searchData };
}
export default useMypageMenu;