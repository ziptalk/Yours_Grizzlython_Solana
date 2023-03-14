import { Result } from 'express-validator';
import { createNftDto } from './../interfaces/user/DTO';
import { PrismaClient } from '@prisma/client';
import errorGenerator from '../middlewares/error/errorGenerator';
import { statusCode, responseMessage } from '../modules/constants';
import config from '../config';
import { s3ForConvertFile } from '../config/s3Config';
import { Blob } from 'buffer';
import fs from 'fs';
import { messageSender } from '../modules/notification';
import { nftNotification, recipient } from '../interfaces/user/NftNotification';
const prisma = new PrismaClient();

const getUserAndNftInfo = async (
  userId: number,
  nftId: number,
  templateCode: string,
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  const nft = await prisma.nfts.findFirst({
    where: {
      id: nftId,
    },
  });
  if (!nft || !user) {
    throw errorGenerator({
      msg: responseMessage.NOT_FOUND,
      statusCode: statusCode.NOT_FOUND,
    });
  }
  const messageInfo: nftNotification = {
    name: user.name,
    nftName: nft.nftName,
    phone: user.phone,
    nftId: nftId,
    photoDescription: nft.options,
    templateCode: templateCode,
  };
  return messageInfo;
};

const makeRecipList = async (userId: number, nftId: number) => {
  const holder = await prisma.user_has_nfts.findMany({
    where: {
      nftId: nftId,
    },
    include: {
      user: {
        select: {
          name: true,
          phone: true,
          id: true,
        },
      },
      nfts: {
        select: {
          nftName: true,
        },
      },
    },
  });
  let recipientList = [];
  for (let i = 0; i < holder.length; i++) {
    if (holder[i].user.id === userId) continue;
    const recipient: recipient = {
      recipientNo: holder[i].user.phone,
      templateParameter: {
        nftId: nftId,
        name: holder[i].user.name,
        nftName: holder[i].nfts.nftName,
      },
    };
    recipientList.push(recipient);
  }
  return recipientList;
};

const getInfoByType = async (userId: number, type: string) => {
  try {
    switch (type) {
      case 'own': {
        const nftsInfo = await prisma.user_has_nfts.findMany({
          where: {
            userId: userId,
          },
          select: {
            nftId: true,
            nfts: {
              select: {
                id: true,
                nftName: true,
                image: true,
                reward: true,
              },
            },
          },
        });

        const data = await Promise.all(
          nftsInfo.map((nftInfo: any) => {
            const result = {
              id: nftInfo.nftId,
              nftName: nftInfo.nfts.nftName,
              image: nftInfo.nfts.image,
              rewards: nftInfo.nfts.reward.length,
            };
            return result;
          }),
        );
        return data;
      }
      case 'reward': {
        const nftsRewardInfo = await prisma.user_has_nfts.findMany({
          where: {
            userId: userId,
          },
          select: {
            nftId: true,
            nfts: {
              select: {
                id: true,
                nftName: true,
                reward: {
                  select: {
                    id: true,
                    rewardName: true,
                  },
                },
              },
            },
          },
        });

        let rewardArray = [];
        for (let i = 0; i < nftsRewardInfo.length; i++) {
          for (let j = 0; j < nftsRewardInfo[i].nfts!.reward.length; j++) {
            const result = {
              nftId: nftsRewardInfo[i].nftId,
              rewardId: nftsRewardInfo[i].nfts.reward[j].id,
              nftName: nftsRewardInfo[i].nfts?.nftName,
              rewardName: nftsRewardInfo[i].nfts?.reward[j].rewardName,
            };
            rewardArray.push(result);
          }
        }
        return rewardArray;
      }
      case 'create': {
        const ownNftsInfo = await prisma.nfts.findMany({
          where: {
            ownerId: userId,
          },
          select: {
            id: true,
            nftName: true,
            image: true,
            reward: true,
          },
        });
        const data = await Promise.all(
          ownNftsInfo.map((ownNftInfo: any) => {
            const result = {
              id: ownNftInfo.id,
              nftName: ownNftInfo.nftName,
              image: ownNftInfo.image,
              rewards: ownNftInfo.reward.length,
            };
            return result;
          }),
        );
        return data;
      }
      default:
        throw errorGenerator({
          msg: responseMessage.NOT_FOUND,
          statusCode: statusCode.NOT_FOUND,
        });
    }
  } catch (error) {
    throw error;
  }
};

const getNftDetailInfo = async (nftId: number) => {
  try {
    const getNftOwners = await prisma.user_has_nfts.findMany({
      where: {
        nftId,
      },
    });
    const getDetailData = await prisma.nfts.findFirst({
      where: {
        id: nftId,
      },
      include: {
        reward: {
          select: {
            id: true,
            rewardName: true,
          },
        },
      },
    });

    const data = {
      id: getDetailData?.id,
      nftName: getDetailData?.nftName,
      image: getDetailData?.image,
      numberOfOwners: getNftOwners.length,
      description: getDetailData?.description,
      chainType: getDetailData?.chainType,
      isDeployed: getDetailData?.isDeployed,
      numberOfRewards: getDetailData?.reward.length,
      rewards: getDetailData?.reward,
      authType: getDetailData?.authType,
      options: getDetailData?.options,
      nftAddress: getDetailData?.nftAddress,
      isEdited: getDetailData?.isEdited,
      createdAt: getDetailData?.createdAt,
      updatedAt: getDetailData?.updatedAt,
    };

    if (!data.id) {
      throw errorGenerator({
        msg: responseMessage.NOT_FOUND,
        statusCode: statusCode.NOT_FOUND,
      });
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const getNftOwnersInfo = async (nftId: number) => {
  try {
    const getNftOwners = await prisma.user_has_nfts.findMany({
      where: {
        nftId: nftId,
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });
    const data = await Promise.all(
      getNftOwners.map((getNftOwner: any) => {
        const result = {
          user: {
            id: getNftOwner.user.id,
            name: getNftOwner.user.name,
            profileImage: getNftOwner.user.profileImage,
          },
        };
        return result;
      }),
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const createNft = async (createNftDto: createNftDto) => {
  try {
    const data = await prisma.nfts.create({
      data: {
        ownerId: createNftDto.ownerId,
        nftName: createNftDto.nftName,
        image: createNftDto.image,
        description: createNftDto.description,
        authType: createNftDto.authType,
        options: createNftDto.options,
        chainType: createNftDto.chainType,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

const verifyMailForNft = async (userId: number, nftId: number) => {
  try {
    const data = await prisma.user_has_nfts.create({
      data: {
        userId: userId,
        nftId: nftId,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

const getOwnNftList = async (userId: number) => {
  try {
    const nftsList = await prisma.user_has_nfts.findMany({
      where: {
        userId: userId,
      },
      select: {
        nftId: true,
      },
    });
    const data = await Promise.all(
      nftsList.map((nftList: any) => nftList.nftId),
    );
    return data;
  } catch (error) {
    throw error;
  }
};
const getCreateNftList = async (userId: number) => {
  try {
    const nftsList = await prisma.nfts.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
      },
    });
    const data = await Promise.all(nftsList.map((nftList: any) => nftList.id));
    return data;
  } catch (error) {
    throw error;
  }
};

const verifyPhotoForNft = async (
  userId: number,
  nftId: number,
  location: string,
) => {
  try {
    const data = await prisma.admin.create({
      data: {
        userId: userId,
        nftId: nftId,
        image: location,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

const getRequestAuthPhoto = async (userId: number, nftId: number) => {
  try {
    const data = await prisma.admin.findFirst({
      where: {
        userId,
        nftId,
        deletedAt: null,
      },
    });
    if (!data) {
      return false;
    }
    return true;
  } catch (error) {
    throw error;
  }
};

const createReward = async (
  userId: number,
  nftId: number,
  rewardName: string,
  description: string,
) => {
  try {
    const findCreaterNft = await prisma.nfts.findFirst({
      where: {
        id: nftId,
        ownerId: userId,
      },
    });
    if (!findCreaterNft) {
      throw errorGenerator({
        msg: responseMessage.NOT_NFT_CREATER,
        statusCode: statusCode.BAD_REQUEST,
      });
    }
    const data = await prisma.admin_reward.create({
      data: {
        nftId,
        rewardName,
        description,
      },
    });

    await prisma.nfts.update({
      where: {
        id: nftId,
      },
      data: {
        isEdited: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

const updateRewardInfo = async (
  userId: number,
  nftId: number,
  rewardId: number,
  rewardName: string,
  description: string,
) => {
  try {
    const findCreaterNft = await prisma.nfts.findFirst({
      where: {
        id: nftId,
        ownerId: userId,
      },
    });
    if (!findCreaterNft) {
      throw errorGenerator({
        msg: responseMessage.NOT_NFT_CREATER,
        statusCode: statusCode.BAD_REQUEST,
      });
    }
    await prisma.admin_reward.update({
      where: {
        id: rewardId,
      },
      data: {
        rewardName,
        description,
      },
    });
    await prisma.nfts.update({
      where: {
        id: nftId,
      },
      data: {
        isEdited: true,
      },
    });
  } catch (error) {
    throw error;
  }
};
const getNftRewardDetailInfo = async (rewardId: number) => {
  try {
    const getRewardDetailInfo = await prisma.reward.findFirst({
      where: {
        id: rewardId,
      },
    });
    if (!getRewardDetailInfo) {
      return null;
    }
    const data = {
      rewardName: getRewardDetailInfo.rewardName,
      description: getRewardDetailInfo.description,
    };
    return data;
  } catch (error) {
    throw error;
  }
};
const getNftWalletAddress = async (userId: number, chainType: string) => {
  try {
    const findNft = await prisma.user_wallet.findFirst({
      where: {
        userId,
        chainType,
      },
    });
    if (!findNft) {
      throw errorGenerator({
        msg: responseMessage.READ_NFT_FAIL,
        statusCode: statusCode.BAD_REQUEST,
      });
    }
    return findNft.walletAddress;
  } catch (error) {
    throw error;
  }
};

const saveNftAddress = async (nftId: number, deployedNft: string) => {
  try {
    await prisma.nfts.update({
      where: {
        id: nftId,
      },
      data: {
        nftAddress: deployedNft,
      },
    });
  } catch (error) {
    throw error;
  }
};

const convertURLtoFile = async (nftId: number) => {
  try {
    const data = await prisma.nfts.findFirst({
      where: {
        id: nftId,
      },
    });
    if (!data) {
      throw errorGenerator({
        msg: responseMessage.BAD_REQUEST,
        statusCode: statusCode.BAD_REQUEST,
      });
    }
    const imageURL = data?.image;
    if (!imageURL) {
      throw errorGenerator({
        msg: responseMessage.NO_IMAGE,
        statusCode: statusCode.BAD_REQUEST,
      });
    }

    //* 파일 데이터 가공
    const fileKey = imageURL?.split('/').pop();
    if (!fileKey) {
      throw errorGenerator({
        msg: responseMessage.BAD_REQUEST,
        statusCode: statusCode.BAD_REQUEST,
      });
    }
    const params = {
      Bucket: config.bucketName,
      Key: fileKey,
    };

    s3ForConvertFile.getObject(params, (error, data) => {
      if (error) {
        throw error;
      }
      // console.log(data);
      // const blob = new Blob([JSON.stringify(data.Body)], {
      //   type: data.ContentType,
      // });
      // // const file = new File([blob], fileKey);
      // // console.log(file);
    });
  } catch (error) {
    throw error;
  }
};

const deleteNftReward = async (
  userId: number,
  nftId: number,
  rewardId: number,
) => {
  try {
    const findCreaterNft = await prisma.nfts.findFirst({
      where: {
        id: nftId,
        ownerId: userId,
      },
    });
    if (!findCreaterNft) {
      throw errorGenerator({
        msg: responseMessage.NOT_NFT_CREATER,
        statusCode: statusCode.BAD_REQUEST,
      });
    }
    await prisma.admin_reward.delete({
      where: {
        id: rewardId,
      },
    });
    await prisma.nfts.update({
      where: {
        id: nftId,
      },
      data: {
        isEdited: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

const updateNftFlag = async (userId: number, nftId: number) => {
  await prisma.user_has_nfts.update({
    where: {
      userId_nftId: { userId, nftId },
    },
    data: {
      isMoved: true,
    },
  });
};

const getNftInfo = async (nftId: number) => {
  const data = await prisma.nfts.findFirst({
    where: {
      id: nftId,
    },
  });
  if (!data) {
    throw errorGenerator({
      msg: responseMessage.BAD_REQUEST,
      statusCode: statusCode.BAD_REQUEST,
    });
  }
  // if (!data.nftAddress) {
  //   throw errorGenerator({
  //     msg: responseMessage.READ_NFT_ADDRESS_FAIL,
  //     statusCode: statusCode.DB_ERROR,
  //   });
  // }
  return data;
};

const getNftMoveFlagList = async (userId: number) => {
  const getNftMoveFlag = await prisma.user_has_nfts.findMany({
    where: {
      userId,
      isMoved: true,
    },
  });
  const result = await Promise.all(
    getNftMoveFlag.map((trueFlag: any) => trueFlag.nftId),
  );
  return result;
};

const getToBeIntegratedNfts = async (userId: number, chainType: string) => {
  try {
    //* 유저가 가지고 있고, 해당 체인, transfer 되지 않은
    const findChainTypeNfts = await prisma.user_has_nfts.findMany({
      where: {
        userId,
        nfts: {
          chainType,
        },
        isMoved: false,
      },
      select: {
        nfts: {
          select: {
            id: true,
            nftName: true,
            image: true,
            reward: true,
          },
        },
      },
    });

    //* 통합 NFT에 들어가있는 nftId 배열 만들기
    //* 리팩토링 고려

    const findIntegratedNftList = await prisma.integrated_has_nfts.findMany({
      select: {
        nftId: true,
      },
    });
    const IntegratedNftIdList = await Promise.all(
      findIntegratedNftList.map(
        (integreatedNftValue: any) => integreatedNftValue.nftId,
      ),
    );

    //* 통합 NFT에 포함되지 않은
    const isNotIntegratedNfts = await Promise.all(
      findChainTypeNfts.filter(
        (findChainTypeNft: any) =>
          !IntegratedNftIdList.includes(findChainTypeNft.nfts.id),
      ),
    );

    //* 반환 데이터 가공
    const data = await Promise.all(
      isNotIntegratedNfts.map(async (isNotIntegratedNft: any) => {
        const result = {
          id: isNotIntegratedNft.nfts.id,
          nftName: isNotIntegratedNft.nfts.nftName,
          image: isNotIntegratedNft.nfts.image,
          numberOfRewards: isNotIntegratedNft.nfts.reward.length,
        };
        return result;
      }),
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const checkNftCreator = async (userId: number, nftId: number) => {
  try {
    const data = await prisma.nfts.findFirst({
      where: {
        id: nftId,
        ownerId: userId,
      },
    });
    if (!data) {
      throw errorGenerator({
        msg: responseMessage.NOT_NFT_CREATER,
        statusCode: statusCode.BAD_REQUEST,
      });
    }
    return true;
  } catch (error) {
    throw error;
  }
};

const getNftInfoWithReward = async (nftId: number) => {
  const getData = await prisma.nfts.findFirst({
    where: {
      id: nftId,
    },
    include: {
      admin_reward: true,
    },
  });
  if (!getData) {
    throw errorGenerator({
      msg: responseMessage.BAD_REQUEST,
      statusCode: statusCode.BAD_REQUEST,
    });
  }
  const benefit = await Promise.all(
    getData.admin_reward.map((benefit: any) => {
      const result = {
        name: benefit.rewardName,
        description: benefit.description,
      };
      return result;
    }),
  );
  const data = {
    nftName: getData.nftName,
    description: getData.description,
    image: getData.image,
    chainType: getData.chainType,
    nftAddress: getData.nftAddress,
    benefit: benefit,
  };
  return data;
};

const updateNftInfo = async (
  nftId: number,
  nftAddress: string,
  transactionDate: Date,
) => {
  try {
    await prisma.nfts.update({
      where: {
        id: nftId,
      },
      data: {
        nftAddress,
        transactionDate,
        isDeployed: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

const updateAtNft = async (nftId: number, date: Date) => {
  await prisma.nfts.update({
    where: {
      id: nftId,
    },
    data: {
      updatedAt: date,
    },
  });
};

const createIntegratedNft = async (
  userId: number,
  nftIdArray: number[],
  chainType: string,
) => {
  try {
    const integratedNft = await prisma.integrated_nfts.create({
      data: {
        chainType,
        creatorId: userId,
      },
    });
    await prisma.user_has_integrated_nfts.create({
      data: {
        integratedNftId: integratedNft.id,
        userId,
      },
    });
    for (let i = 0; i < nftIdArray.length; i++) {
      await prisma.integrated_has_nfts.create({
        data: {
          integratedNftId: integratedNft.id,
          nftId: nftIdArray[i],
        },
      });
    }
    const data = {
      id: integratedNft.id,
      chainType: integratedNft.chainType,
      createdAt: integratedNft.createdAt,
    };
    return data;
  } catch (error) {
    throw error;
  }
};

const updateIntegratedNft = async (
  userId: number,
  integratedNftId: number,
  nftIdArray: number[],
) => {
  try {
    const checkUserNft = await prisma.user_has_integrated_nfts.findFirst({
      where: {
        integratedNftId,
        userId,
      },
    });
    if (!checkUserNft) {
      throw errorGenerator({
        msg: responseMessage.READ_INTEGRATED_NFT_FAIL,
        statusCode: statusCode.BAD_REQUEST,
      });
    }
    for (let i = 0; i < nftIdArray.length; i++) {
      await prisma.integrated_has_nfts.create({
        data: {
          integratedNftId: integratedNftId,
          nftId: nftIdArray[i],
        },
      });
    }
  } catch (error) {
    throw error;
  }
};
const getIntegratedNftInfo = async (id: number) => {
  try {
    const integratedInfo = await prisma.integrated_nfts.findFirst({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!integratedInfo) {
      throw errorGenerator({
        msg: responseMessage.READ_INTEGRATED_NFT_FAIL,
        statusCode: statusCode.BAD_REQUEST,
      });
    }
    const getNftArrayInfo = await prisma.integrated_has_nfts.findMany({
      where: {
        integratedNftId: id,
      },
      include: {
        nfts: {
          include: {
            reward: true,
          },
        },
      },
    });
    const nftArray = await Promise.all(
      getNftArrayInfo.map((nftInfo: any) => {
        const result = {
          nftId: nftInfo.id,
          nftName: nftInfo.nfts.nftName,
          nftImage: nftInfo.nfts.image,
        };
        return result;
      }),
    );
    let rewardArray = [];
    for (let i = 0; i < getNftArrayInfo.length; i++) {
      for (let j = 0; j < getNftArrayInfo[i].nfts!.reward.length; j++) {
        const result = {
          nftId: getNftArrayInfo[i].nftId,
          nftName: getNftArrayInfo[i].nfts?.nftName,
          rewardName: getNftArrayInfo[i].nfts?.reward[j].rewardName,
        };
        rewardArray.push(result);
      }
    }
    const data = {
      id: integratedInfo?.id,
      userName: integratedInfo?.user?.name,
      chainType: integratedInfo?.chainType,
      createdAt: integratedInfo?.createdAt,
      nftArray: nftArray,
      rewardArray: rewardArray,
    };
    return data;
  } catch (error) {
    throw error;
  }
};

const getIntegratedNftList = async (userId: number) => {
  try {
    const IntegratedNftList = await prisma.user_has_integrated_nfts.findMany({
      where: {
        userId,
      },
      include: {
        integrated_nfts: {
          select: {
            chainType: true,
          },
        },
      },
    });
    const data = await Promise.all(
      IntegratedNftList.map((integratedNft: any) => {
        const result = {
          chainType: integratedNft.integrated_nfts.chainType,
          integratedNftId: integratedNft.integratedNftId,
        };
        return result;
      }),
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const deleteIntegratedNft = async (userId: number, id: number) => {
  try {
    await prisma.integrated_has_nfts.deleteMany({
      where: {
        integratedNftId: id,
      },
    });
    await prisma.user_has_integrated_nfts.deleteMany({
      where: {
        integratedNftId: id,
        userId,
      },
    });
    await prisma.integrated_nfts.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
};

const equalRewardInfo = async (nftId: number) => {
  try {
    const web3RewardInfo = await prisma.admin_reward.findMany({
      where: {
        nftId,
      },
    });

    // reward 정보 삭제
    await prisma.reward.deleteMany({
      where: {
        nftId,
      },
    });

    // admin_reward 정보를 reward 정보로 업데이트
    await Promise.all(
      web3RewardInfo.map(async (web3Reward: any) => {
        await prisma.reward.create({
          data: {
            nftId,
            rewardName: web3Reward.rewardName,
            description: web3Reward.description,
          },
        });
      }),
    );

    await prisma.nfts.update({
      where: {
        id: nftId,
      },
      data: {
        isEdited: false,
      },
    });
  } catch (error) {
    throw error;
  }
};

const equalReward = async (nftId: number) => {
  try {
    const web3RewardInfo = await prisma.admin_reward.findMany({
      where: {
        nftId,
      },
    });

    // admin_reward 정보를 reward 정보로 업데이트
    await Promise.all(
      web3RewardInfo.map(async (web3Reward: any) => {
        await prisma.reward.create({
          data: {
            nftId,
            rewardName: web3Reward.rewardName,
            description: web3Reward.description,
          },
        });
      }),
    );

    await prisma.nfts.update({
      where: {
        id: nftId,
      },
      data: {
        isEdited: false,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default {
  getInfoByType,
  getNftDetailInfo,
  getNftOwnersInfo,
  createNft,
  verifyMailForNft,
  getOwnNftList,
  getCreateNftList,
  verifyPhotoForNft,
  getRequestAuthPhoto,
  createReward,
  updateRewardInfo,
  getNftRewardDetailInfo,
  getNftWalletAddress,
  saveNftAddress,
  convertURLtoFile,
  deleteNftReward,
  updateNftFlag,
  getNftInfo,
  getNftMoveFlagList,
  getToBeIntegratedNfts,
  checkNftCreator,
  getNftInfoWithReward,
  updateNftInfo,
  updateAtNft,
  createIntegratedNft,
  updateIntegratedNft,
  getIntegratedNftInfo,
  getIntegratedNftList,
  deleteIntegratedNft,
  equalRewardInfo,
  getUserAndNftInfo,
  makeRecipList,
  equalReward,
};
