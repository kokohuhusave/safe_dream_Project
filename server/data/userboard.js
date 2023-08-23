import { db } from '../db/database.js';
// 게시판 리스트 불러오기

export async function list(category, page) {
    console.log(page)
    if (category === '전체') {
        return db.execute('SELECT post_id, title, DATE_FORMAT(created_At, \'%Y-%m-%d\') as created_At FROM board order by post_id desc limit ?, 15 ', [page])
        .then((result) => result[0]);
    } else {
    return db.execute('SELECT post_id, title, DATE_FORMAT(created_At, \'%Y-%m-%d\') as created_At FROM board WHERE category=? order by post_id desc limit ?, 15', [category, page])
    .then((result) => result[0])}

}
 
// 게시판 글쓰기
export async function createBoard(userid, category, title, content){   
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
