import prisma from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { CreatePostDto, UpdatePostDto, PostResponse } from './post.types';

export const getAllPosts = async (): Promise<PostResponse[]> => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return posts;
};

export const createPost = async (
  dto: CreatePostDto,
  authorId: string
): Promise<PostResponse> => {
  const post = await prisma.post.create({
    data: {
      title: dto.title,
      content: dto.content,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return post;
};

export const updatePost = async (
  postId: string,
  dto: UpdatePostDto,
  userId: string
): Promise<PostResponse> => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.authorId !== userId) {
    throw new AppError(
      'You do not have permission to update this post',
      403
    );
  }

  const updated = await prisma.post.update({
    where: { id: postId },
    data: {
      title: dto.title,
      content: dto.content,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return updated;
};

export const deletePost = async (
  postId: string,
  userId: string
): Promise<void> => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.authorId !== userId) {
    throw new AppError(
      'You do not have permission to delete this post',
      403
    );
  }

  await prisma.post.delete({
    where: { id: postId },
  });
};
