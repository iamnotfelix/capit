import { Post } from "../models";
import axiosService from "../utils/axios";

export const postsService = {
  addPost,
  getAllPosts,
  getCanPostToday,
};

function addPost(attemptId: string, token: string) {
  return axiosService
    .post<Post>(
      `posts`,
      { attemptId: attemptId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response) => {
      return response.data;
    });
}

function getAllPosts(token: string) {
  return axiosService
    .get<Post[]>(`posts`, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      return response.data;
    });
}

function getCanPostToday(token: string) {
  return axiosService
    .get<boolean>(`posts/me/canposttoday`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      return response.data;
    });
}
