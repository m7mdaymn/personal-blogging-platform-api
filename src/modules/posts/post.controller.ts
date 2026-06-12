import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/response';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as postService from './post.service';

export const getAllPosts = asyncHandler(async (_req: Request, res: Response) => {
  const posts = await postService.getAllPosts();
  sendSuccess(res, posts, 'Posts retrieved successfully', 200);
});

export const createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await postService.createPost(req.body, req.user!.id);
  sendSuccess(res, post, 'Post created successfully', 201);
});

export const updatePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const post = await postService.updatePost(id, req.body, req.user!.id);
  sendSuccess(res, post, 'Post updated successfully', 200);
});

export const deletePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await postService.deletePost(id, req.user!.id);
  sendSuccess(res, null, 'Post deleted successfully', 200);
});
