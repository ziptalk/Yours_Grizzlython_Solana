export default {
  NULL_VALUE: '필요한 값이 없습니다.',
  OUT_OF_VALUE: '파라미터 값이 잘못되었습니다.',
  NOT_FOUND: '잘못된 경로입니다.',
  BAD_REQUEST: '잘못된 요청입니다.',
  NO_USER: '존재하지 않는 유저',
  NO_IMAGE: '이미지가 없습니다.',
  UNAUTHORIZED: '권한이 없습니다.',

  // 회원가입 및 로그인
  SIGNUP_SUCCESS: '회원 가입 성공',
  SIGNUP_FAIL: '회원 가입 실패',
  SIGNIN_SUCCESS: '로그인 성공',
  SIGNIN_FAIL: '회원 가입이 필요한 유저입니다.',
  ALREADY_NICKNAME: '이미 사용중인 닉네임입니다.',
  INVALID_PASSWORD: '잘못된 비밀번호입니다.',
  SEND_MESSAGE_SUCCESS: '인증코드 문자 발송 성공',
  VERIFY_AUTH_CODE_SUCCESS: '인증코드 일치 여부 확인 성공',

  // 토큰
  CREATE_TOKEN_SUCCESS: '토큰 재발급 성공',
  EXPIRED_TOKEN: '토큰이 만료되었습니다.',
  EXPIRED_ALL_TOKEN: '모든 토큰이 만료되었습니다.',
  INVALID_TOKEN: '유효하지 않은 토큰입니다.',
  VALID_TOKEN: '유효한 토큰입니다.',
  EMPTY_TOKEN: '토큰 값이 없습니다.',

  //* 웹3
  // SUCCESS: 'SUCCESS',
  // NO_DATA: 'NO_DATA',
  // NO_WALLET: 'NO_WALLET',
  // NET_ERROR: 'NET_ERROR',
  // REJECTED: 'REJECTED',
  IPFS_ERROR: 'ipfs 오류입니다.',
  META_ERROR: '메타 데이터 업로드 실패',
  BENEFIT_DATA_ERROR: '혜택 데이터 업로드 실패',
  // MINT_ERROR: 'MINT_ERROR',

  //마이 페이지
  READ_USER_INFO_SUCCESS: '유저 정보 조회 성공',
  READ_CATEGORY_INFO_SUCCESS: '카테고리 별 정보 조회 성공',
  READ_SEARCH_INFO_SUCCESS: '정보 검색 성공',
  UPDATE_PROFILE_PHOTO_SUCCESS: '유저 프로필 사진 수정 성공',
  UPDATE_PHONE_NUMBER_SUCCESS: '유저의 휴대폰 번호 수정 성공',
  UPDATE_EMAIL_SUCCESS: '유저의 이메일 수정 성공',
  UPDATE_NICKNAME_SUCCESS: '유저의 닉네임 수정 성공',
  SEND_AUTH_EMAIL_SUCCESS: '이메일 인증 발송 성공',
  GET_QUESTINFO_SUCCESS: '퀘스트 완료 여부 조회 성공',
  UPDATE_QUESTINFO_SUCCESS: '퀘스트 완료 여부 업데이트 성공',
  UPDATE_SECRET_SUCCESS: '유저의 secret 수정 성공',

  //NFT
  READ_NFT_DETAIL_INFO_SUCCESS: 'NFT 상세 정보 조회 성공',
  READ_NFT_OWNERS_INFO_SUCCESS: 'NFT 소유자 정보 조회 성공',
  READ_NFT_FAIL: 'NFT 조회 실패',
  CREATE_NFT_SUCCESS: 'NFT 생성 성공',
  SEND_AUTH_MAIL_SUCCESS: 'NFT 인증 이메일 발송 성공',
  VERIFY_EMAIL_AUTH_SUCCESS: 'NFT 이메일 인증 및 민팅 성공',
  VERIFY_EMAIL_AUTH_FAIL: 'NFT 이메일 인증 실패',
  READ_NFT_ID_LIST_SUCCESS: 'NFT Id 리스트 조회 성공',
  READ_CREATE_NFT_ID_LIST_SUCCESS: '생성한 NFT Id 리스트 조회 성공',
  SEND_AUTH_PHOTO_SUCCESS: 'NFT 인증 사진 제출 성공',
  READ_GET_REQUEST_PHOTO_SUCCESS: 'NFT 사진 인증 대기 여부 조회 성공',
  CREATE_NFT_REWARD_SUCCESS: 'NFT 혜택 생성 성공',
  NOT_NFT_CREATER: 'NFT 생성자가 아닙니다.',
  UPDATE_NFT_REWARD_SUCCESS: 'NFT 혜택 수정 성공',
  READ_NFT_REWARD_DETAIL_INFO_SUCCESS: 'NFT 혜택 상세보기 조회 성공',
  DELETE_NFT_REWARD_SUCCESS: 'NFT 혜택 삭제 성공',
  TRANSFER_NFT_SUCCESS: 'NFT 옮겨가기 성공',
  READ_NFT_FLAG_LIST_SUCCESS: 'NFT 전송 유무 리스트 조회 성공',
  READ_TO_BE_INTEGRATED_NFTS_SUCCESS: '통합될 NFT 확인 정보 조회 성공',
  READ_NFT_ADDRESS_FAIL: 'NFT 주소가 없습니다.',
  PUBLISH_NFT_SUCCESS: 'NFT 발행 성공',
  UPDATE_NFT_BENEFIT_SUCCESS: 'NFT 혜택 수정 및 발행 성공',
  CREATE_INTEGRATED_NFT_SUCCESS: '통합 NFT 생성 성공',
  UPDATE_INTEGRATED_NFT_SUCCESS: '통합 NFT 수정 성공',
  READ_INTEGRATED_NFT_FAIL: '유저가 소유하고 있지 않는 통합 NFT입니다.',
  READ_INTEGRATED_NFT_DETAIL_SUCCESS: '통합 NFT 상세 정보 조회 성공',
  READ_INTEGRATED_NFT_SUCCESS: '유저가 가진 통합 NFT 리스트 조회 성공',
  DELETE_INTEGRATED_NFT_SUCCESS: '통합 NFT 삭제 성공',
  READ_NFT_ADMIN_REWARD_INFO_SUCCESS: '관리자용 NFT 혜택 조회 성공',
  READ_NFT_ADMIN_REWARD_DETAIL_INFO_SUCCESS: '관리자용 NFT 혜택 상세 조회 성공',

  //ADMIN
  READ_AUTH_PEOPLE_SUCCESS: '들어온 인증 요청 조회 성공',
  READ_AUTH_PEOPLE_DETAIL_SUCCESS: '인증 요청 상세보기 조회 성공',
  APPROVE_NFT_SUCCESS: 'NFT 사진 인증 승인 성공',
  APPROVE_NFT_FAIL: 'NFT 사진 인증 거절',

  //USER
  GET_WALLETINFO_SUCCESS: '지갑 정보 조회에 성공하였습니다.',

  //알림톡
  SEND_NOTIFICATION_MESSAGE_SUCCESS: '알림톡이 성공적으로 전송되었습니다.',
  SEND_NOTIFICATION_MESSAGE_FAIL:
    '알림톡 발송에 실패하였습니다. 메시지를 확인해주세요.',

  // 서버 내 오류
  INTERNAL_SERVER_ERROR: '서버 내 오류',
};
