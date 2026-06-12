export interface CreatePostDto {
  title: string;
  content: string;
}

export interface UpdatePostDto {
  title: string;
  content: string;
}

export interface PostResponse {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
