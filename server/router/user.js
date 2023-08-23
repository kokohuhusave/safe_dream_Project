import express from 'express';
import * as userController from '../controllers/user.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

// 회원정보 
router.get('/', isAuth, userController.getAll);// 정보 조회
router.get('/:userid', isAuth, userController.getOne);// 정보 조회
router.post('/',isAuth, userController.createUser);// 계정 추가
router.put('/:userid',isAuth, userController.updateUser);// 계정 수정
router.delete('/:userid',isAuth, userController.deleteUser);// 계정 삭제 

export default router;