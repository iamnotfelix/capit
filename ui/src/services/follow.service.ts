import { Follow } from "../models";
import axiosService from "../utils/axios";

export const followsService = {
  addFollow,
  deleteFollow,
  isFollowing,
};

function addFollow(followingId: string, token: string) {
  return axiosService
    .post<Follow>(
      `follows`,
      { followingId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response) => {
      return response.data;
    });
}

function deleteFollow(followingId: string, token: string) {
  return axiosService
    .delete(`follows/me/${followingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      return response.data;
    });
}

function isFollowing(userId: string, token: string) {
  return axiosService
    .get<boolean>(`follows/me/isfollowing/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      return response.data;
    });
}
