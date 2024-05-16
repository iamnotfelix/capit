import { Post } from "../models";
import axiosService from "../utils/axios";

export const postsService = {
  addPost,
  getAllPosts,
  getCanPostToday,
  getPostsByUserId,
  deletePostById,
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

function getPostsByUserId(userId: string, token: string) {
  return axiosService
    .get<Post[]>(`posts/byuser/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      return response.data;
    });
}

function deletePostById(postId: string, token: string) {
  return axiosService
    .delete(`posts/me/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      return response.data;
    });
}
