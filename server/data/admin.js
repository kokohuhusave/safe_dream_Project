import { db } from '../db/database.js';

export async function findByUsername(username) {
    return db.execute('select * from user where username=?', [username]).then((result) => result[0][0]);
}

export async function findById(userid){
    console.log("들어옴 findById");
    console.log(userid);
    return db.execute('select userid from admin where userid=?', [userid]).then((admin) => admin[0][0]);
}

export async function UserfindById(userid){
    console.log("들어옴 UserfindById");
    console.log(userid);
    return db.execute('select userid from user where userid=?', [userid]).then((user) => user[0][0]);
}


export async function login(userid, password) {
    return db.execute('select * from admin where userid=? and password=?', [userid, password]).then((result) => result[0][0]);

}

// 게시판 리스트 불러오기
 
export async function list(category, page) {
    console.log(page)
    if (category === '전체') {
        return db.execute('SELECT post_id, category, userid, title, DATE_FORMAT(created_At, \'%Y-%m-%d %H:%i:%s\') as created_At FROM board order by created_At desc limit ?, 10 ', [page])
          .then((result) => result[0]);
    } else {
    return db.execute('SELECT post_id, category, userid, title, DATE_FORMAT(created_At, \'%Y-%m-%d %H:%i:%s\') as created_At FROM board WHERE category=? order by created_At desc limit ?, 10', [category, page])
    .then((result) => result[0])}

}

// 게시판 글쓰기
export async function createBoard(category, title, content){   
    const userid = 'Admin'
    return db.execute('insert into board(userid, category, title, content) values (?, ?, ?, ?)', [userid, category, title, content])
    .then((result) => console.log(result[0]));
}

// 게시판 글 읽어오기
export async function read(post_id) {
    return db.execute('SELECT category, userid, title, content,DATE_FORMAT(created_At, \'%Y-%m-%d %H:%i:%s\') as created_At FROM board WHERE post_id=?', [post_id])
    .then((result) => result[0])
}
// 게시판 글 삭제하기
export async function deleteboard(post_id){
    return db.execute('delete from board where post_id=?', [post_id])
    .then((result) => console.log(result[0]))
}


// 메인 페이지에 유저 카운팅하기
export async function countUser() {
    return db.execute('SELECT COUNT(*) AS count FROM user')
        .then((result) => result[0][0].count)
        .catch(err => console.log(err))
}

//메인 페이지에 게시글 카운팅하기
export async function countBoard() {
    const query1 = 'SELECT COUNT(*) AS count FROM board WHERE category="자유게시판" or category="위험지역 공유"';
    const query2 = 'SELECT COUNT(*) AS count FROM board WHERE category="공지"';

    const result1 = await db.execute(query1).then((result) => result[0][0].count).catch(err => console.log(err));
    const result2 = await db.execute(query2).then((result) => result[0][0].count).catch(err => console.log(err));

    return {
        countBoardUser: result1,
        countBoardAdmin: result2
        //     return db.execute('SELECT COUNT(*) AS count FROM board WHERE category="자유게시판" or category="위험지역 공유"')
        //     .then((result) =>result[0][0].count)
        //     .catch(err => console.log(err))
    }
}