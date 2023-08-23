import * as userRepository from "../data/user.js"
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export async function getAll(req, res, next){
    const users = await userRepository.getAll();
    console.log("회원 조회 완료.");   
    return res.status(200).json(users);
}

export async function getOne(req, res, next){
  const id = req.params.userid;
  const user = await userRepository.getById(id)
  if(user) {
    res.status(200).json(user);
  }else{
    res.status(404).json({message: `user id(${id}) not found`})
  }
}


// 회원 추가 완료 (포스맨에서 확인완료)
export async function createUser(req, res, next){
  try {
    const { userid, username, password, guardianHp, hp } = req.body;

    await userRepository.createUser(userid, username, password, guardianHp, hp);

    res.json({ message: '회원 정보가 추가되었습니다.' });

  } catch (error) {
    console.error('회원 정보를 추가하는 중 오류가 발생했습니다.', error);
    res.status(500).json({ error: '서버 오류' });
  }
}

// 회원 정보 수정
export async function updateUser(req, res, next) {
  try {
    const { userid } = req.params;
    const { username, password, guardianHp, hp } = req.body;

    await userRepository.update(userid, username, password, guardianHp, hp);

    res.json({ message: '회원 정보가 수정되었습니다.' });
  } catch (error) {
    console.error('회원 정보를 수정하는 중 오류가 발생했습니다.', error);
    res.status(500).json({ error: '서버 오류' });
  }
  }
  // 회원 정보 삭제
  export async function deleteUser(req, res, next) {
    try {
      const { userid } = req.params;
  
      await userRepository.remove(userid);
  
      res.json({ message: '회원 정보가 삭제되었습니다.' });
    } catch (error) {
      console.error('회원 정보를 삭제하는 중 오류가 발생했습니다.', error);
      res.status(500).json({ error: '서버 오류' });
    }
  }