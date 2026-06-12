import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { createPostSchema, updatePostSchema } from './post.validation';
import * as postController from './post.controller';

const router = Router();

router.get('/', postController.getAllPosts);
router.post('/', authenticate, validate(createPostSchema), postController.createPost);
router.put('/:id', authenticate, validate(updatePostSchema), postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);

export default router;
