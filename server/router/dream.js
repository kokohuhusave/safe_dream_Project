import express from 'express';
import * as userController from '../controllers/userController.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', userController.login); // 로그인
router.post('/register', userController.register); // 회원 가입
router.get('/check', userController.checkUserId); // 아이디 중복 체크
router.put('/update', isAuth, userController.updateUser); // 회원 정보 수정
router.delete('/:userid', isAuth, userController.deleteUser); // 회원 삭제
router.post('/findUserId', userController.findUserId); // 아이디 찾기

// 보호자 전화번호 받기 
router.get('/guardianHp', isAuth, userController.guardianHp);

//게시판
router.get('/board_user', isAuth, userController.createlist)
router.get('/board_tailpage', isAuth, userController.readBoard)
router.post('/board_create', isAuth, userController.newBoard);


export default router;
