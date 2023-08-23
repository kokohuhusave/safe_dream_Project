import bcrypt from 'bcrypt';
import { config } from '../config.js';
import { db as pool } from '../db/database.js';
import jwt from 'jsonwebtoken';
import * as adminRepository from '../data/admin.js';
import * as Repository from '../data/userboard.js';




// 회원가입을 처리하는 새로운 함수
export const register = async (req, res) => {
    const { userid, username, password, guardianHp, hp } = req.body;
    try {
        const existUsers = await pool.query("SELECT * FROM user WHERE userid = ?", [userid]);
        if (existUsers[0].length > 0) {
            return res.status(400).json({
                message: "해당 아이디가 이미 존재합니다."
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
        const newUser = await pool.query("INSERT INTO user ( userid, username, password, guardianHp, hp) VALUES (?, ?, ?, ?, ?)",
            [userid, username, hashedPassword, guardianHp, hp]);
        res.status(201).json({
            message: "성공적으로 등록되었습니다."
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "여기서 오류??"
        });
    }
};

// 아이디 중복
export async function checkUserId(req, res) {
    const userid = req.query.userid;
    if (!userid) {
        return res.status(400).json({message: '아이디를 입력해 주세요.'});
    }

    try {
        const [result] = await pool.query(`SELECT userid FROM user WHERE userid=?`, [userid]);
        if (result.length > 0) {
            return res.status(400).json({message: '이미 사용중인 아이디입니다.'});
        } else {
            return res.status(200).json({message: '사용 가능한 아이디입니다.'});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: '서버 오류'});
    }
}
// 로그인
export async function login(req, res) {
    const { userid, password } = req.body;
    const sql = 'SELECT * FROM user WHERE userid = ?';

    try {
        const [users] = await pool.query(sql, [userid]);
        if (users.length === 0) {
            return res.status(401).json({ message: '유효하지 않은 사용자 인증 정보' });
        }
        const user = users[0];
        // 여기서 로그를 출력하여 실제로 받아온 비밀번호와 DB에 저장된 비밀번호를 확인해보세요.
        console.log('Received password:', password);
        console.log('Stored password:', user.password);
        
        const validPassword = await bcrypt.compare(password, user.password);
        
        // validPassword 값도 출력해보면 좋겠습니다.
        console.log('Is password valid?', validPassword);
        
        if (!validPassword) {
            return res.status(401).json({ message: '유효하지 않은 사용자 인증 정보' });
        }

        // res.status(200).json({ message: '로그인 성공' });
        const token = createJwtToken(user.userid);
        return res.status(200).json({ token, userid });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
};

// 회원 정보 수정
export async function updateUser(req, res) {
    const { username, password, hp, guardianHp } = req.body;
    const userid = await adminRepository.UserfindById(req.userid);

    try {
        // bcrypt를 사용해 새로운 비밀번호를 해시화
        const hashedPassword = await bcrypt.hash(password, 10);

        // DB에 업데이트 쿼리를 보냄
        const sql = 'UPDATE user SET username = ?, password = ?, guardianHp = ?, hp = ? WHERE userid = ?';
        await pool.query(sql, [username, hashedPassword, guardianHp,hp, userid.userid]);

        res.status(200).json({ message: '회원 정보 수정 성공' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}

export async function deleteUser(req, res) {
    const userid = await adminRepository.UserfindById(req.userid);
    try {
        // DB에서 해당 사용자를 삭제
        const sql = 'DELETE FROM user WHERE userid = ?';
        await pool.query(sql, [userid.userid]);
        console.log(userid);

        res.status(200).json({ message: '회원 삭제 성공' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}

// 유저 아이디 찾기 함수
export async function findUserId(req, res) {
    const username = req.body.username;
    const HP = req.body.HP;
    if (!username || !HP) {
        return res.status(400).json({error: '이름과 전화번호를 입력해 주세요.'});
    }
    try {
        const [result] = await pool.query(`SELECT userid FROM user WHERE username=? AND HP=?`, [username, HP]);
        if (result.length > 0) {
            return res.status(200).json({foundUserID: result[0].userid});
        } else {
            return res.status(400).json({error: '이름과 전화번호가 맞지 않습니다.'});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: '서버 오류'});
    }
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

// 보호자 전화번호 받아오기 
export async function guardianHp(req, res, next){

    console.log("컨트롤러들어옴");
    const userid = await adminRepository.UserfindById(req.userid);

    try {
        // DB에서 해당 사용자를 삭제
        const sql = 'SELECT guardianHp FROM user WHERE userid = ?';
        const [rows] = await pool.query(sql, [userid.userid]);
        const guardianHp = rows[0].guardianHp;
    
        // 성공시 보호자 번호 
        res.status(200).json({ guardianHp });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}


// 드림앱 게시판 리스트 생성

export async function createlist(req, res) {
    const category = req.query.category;
    let page = req.query.page;
    // MySQL에서 게시판 정보를 조회합니다.
    const result = await Repository.list(category, page);

    if(!result){
        return res.status(401).json({ error: 'Invalid userid' });
    }

    return res.status(200).json({result})
}

// 드림앱 게시글 작성하기
export async function newBoard(req, res){

    //토큰값 불러오기
    const userid = await adminRepository.UserfindById(req.userid);
    console.log("----------------user");
    const {category, title, content} = req.body;
    console.log(category)
    const board = await Repository.createBoard(userid.userid, category, title, content);
    return res.status(201).json(board)
}

// 드림앱 게시글 읽기
export async function readBoard(req, res) {
    const post_id = req.query.post_id;
    // MySQL에서 게시판 정보를 조회합니다.

    const data = await Repository.read(post_id);
    if(!data){
        return res.status(401).json({ error: '게시글을 불러올 수 없습니다.' });
    }
    return res.status(200).json({data})
}

// 드림앱 게시글 삭제하기
export async function deleteBoard(req, res){
    try{
        const post_id = req.query.post_id;
        await Repository.deleteboard(post_id);
        res.sendStatus(204);

    }catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }

}
