import bcrypt from 'bcrypt';
import * as adminRepository from '../data/admin.js';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';



export async function login(req, res, next){
    const { userid, password } = req.body;

        // MySQL에서 사용자 정보를 조회합니다.
    const result = await adminRepository.login(userid, password);
    if(!result){
        return res.status(401).json({ error: 'Invalid userid or password' });
    }

    const token = createJwtToken(result.userid);
    return res.status(200).json({ token, userid });
}

// 토큰 인증방식 
export async function me (req, res, next){
    const user = await adminRepository.findById(req.userid);
    if(!user){
        return res.status(404).json({ message:'사용자가 존재하지 않음'});
    }
    res.status(200).json({ token: req.token, username: user.username});
}

function createJwtToken(userid) {
    return jwt.sign({userid}, config.jwt.secretKey, {expiresIn: config.jwt.expiresInSec})
}

// 게시판 리스트 생성

export async function createlist(req, res) {
    const category = req.query.category;
    let page = req.query.page;
    // MySQL에서 게시판 정보를 조회합니다.
    const result = await adminRepository.list(category, page);
    if(!result){
        return res.status(401).json({ error: 'Invalid userid' });
    }
    return res.status(200).json({result})
}
// [관리자] 게시글 작성하기
export async function newBoard(req, res){
    const {category, title, content} = req.body;
    console.log(category)
    const board = await adminRepository.createBoard(category, title, content, req.userid);
    return res.status(201).json(board)
}

// [관리자] 게시글 읽기
export async function readBoard(req, res) {
    const post_id = req.query.post_id;
    // MySQL에서 게시판 정보를 조회합니다.
    const data = await adminRepository.read(post_id);
    if(!data){
        return res.status(401).json({ error: '게시글을 불러올 수 없습니다.' });
    }
    return res.status(200).json({data})
}

// [관리자] 게시글 삭제하기
export async function deleteBoard(req, res){
    const post_id = req.query.post_id;
    await adminRepository.deleteboard(post_id)
    res.sendStatus(204)
}

// 메인페이지 카운팅 추가

export async function countMain(req, res) {
    const countUser = await adminRepository.countUser();
    const countBoard = await adminRepository.countBoard();
    console.log(countUser, countBoard)
    if(!countUser){
        return res.status(401).json({ error: '유저 수 에러' });
    }
    if(!countBoard){
        return res.status(401).json({ error: '게시글 수 에러' });
    }
    return res.status(200).json({countUser, countBoard})
}

