import { Router } from 'express';
import auth from '../middlewares/auth';
import { nftController } from '../controllers';
import { body, param, query } from 'express-validator';
import errorValidator from '../middlewares/error/errorValidator';
import upload from '../middlewares/upload';

const router: Router = Router();

router.get(
  '/integrated/detail',
  [query('id').notEmpty()],
  errorValidator,
  nftController.getIntegratedNftInfo,
);

router.get('/integrated', auth, nftController.getIntegratedNftList);
router.delete(
  '/integrated',
  [query('id').notEmpty()],
  errorValidator,
  auth,
  nftController.deleteIntegratedNft,
);
router.get(
  '/',
  [query('type').notEmpty().isIn(['create', 'owm', 'reward'])],
  auth,
  nftController.getInfoByType,
);

router.post(
  '/',
  upload.single('image'),
  [
    body('nftName').notEmpty(),
    body('description').notEmpty(),
    body('authType').notEmpty(),
    body('options').notEmpty(),
    body('chainType')
      .notEmpty()
      .isIn(['Ethereum', 'Polygon', 'Klaytn', 'Solana', 'Aptos']),
  ],
  errorValidator,
  auth,
  nftController.createNft,
);
router.post(
  '/email',
  [body('nftId').notEmpty(), body('email').isEmail().notEmpty()],
  errorValidator,
  auth,
  nftController.sendAuthMailForNft,
);
router.post(
  '/email/verification',
  [body('code').notEmpty()],
  errorValidator,
  nftController.verifyMailForNft,
);
router.get('/own', auth, nftController.getOwnNftList);
router.get('/creation', auth, nftController.getCreateNftList);
router.post(
  '/verification/photo',
  upload.single('image'),
  [body('nftId').notEmpty()],
  auth,
  nftController.verifyPhotoForNft,
);
router.get('/send', auth, nftController.getNftMoveFlagList);

router.get('/integrated/check', [
  query('chainType').isIn(['Ethereum', 'Polygon', 'Klaytn', 'Solana', 'Aptos']),
  errorValidator,
  auth,
  nftController.getToBeIntegratedNfts,
]);

router.post(
  '/publish',
  [body('nftId').isNumeric().notEmpty()],
  errorValidator,
  auth,
  nftController.publishNFT,
);

router.patch(
  '/publish',
  [body('nftId').isNumeric().notEmpty()],
  errorValidator,
  auth,
  nftController.updateNftBenefit,
);

router.post(
  '/integrated',
  [
    body('nftIdArray').isArray().notEmpty(),
    body('chainType')
      .isString()
      .notEmpty()
      .isIn(['Ethereum', 'Polygon', 'Klaytn', 'Solana', 'Aptos']),
  ],
  errorValidator,
  auth,
  nftController.createIntegratedNft,
);

router.patch(
  '/integrated',
  [
    body('integratedNftId').isNumeric().notEmpty(),
    body('nftIdArray').isArray().notEmpty(),
  ],
  errorValidator,
  auth,
  nftController.updateIntegratedNft,
);

router.get(
  '/:nftId/detail',
  [param('nftId').notEmpty()],
  errorValidator,
  nftController.getNftDetailInfo,
);
router.get(
  '/:nftId/owners',
  [param('nftId').notEmpty()],
  errorValidator,
  nftController.getNftOwnersInfo,
);

router.get(
  '/:nftId/photo',
  [param('nftId').notEmpty()],
  errorValidator,
  auth,
  nftController.getRequestAuthPhoto,
);

router.post(
  '/:nftId/reward',
  [
    param('nftId').notEmpty(),
    body('rewardName').notEmpty(),
    body('description').notEmpty(),
  ],
  errorValidator,
  auth,
  nftController.createReward,
);

router.patch(
  '/:nftId/reward',
  [body('rewardId').notEmpty(), body('rewardName'), body('description')],
  errorValidator,
  auth,
  nftController.updateRewardInfo,
);
router.get('/:rewardId/reward/detail', nftController.getNftRewardDetailInfo);

// router.post(
//   '/:nftId/transfer',
//   [body('walletAddress')],
//   errorValidator,
//   auth,
//   nftController.transferNFT,
// );

router.delete(
  '/:nftId/:rewardId',
  [param('rewardId').notEmpty()],
  errorValidator,
  auth,
  nftController.deleteNftReward,
);

export default router;
