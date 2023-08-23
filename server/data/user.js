import { db } from '../db/database.js';

export async function getAll() {
    return db.execute('select userid, username, guardianHp, guardianHp2, hp from user').then((result) => result[0]);
}

export async function getById(id) {
    return db.query('select userid, username, guardianHp, guardianHp2, hp from user WHERE userid = ?', [id]).then((result) => result[0][0])
}

export async function createUser(userid, username, password, guardianHp,  hp) {
    const query = 'INSERT INTO user (userid, username, password, guardianHp, hp) VALUES (?, ?, ?, ?, ?)';
    const values = [userid, username, password, guardianHp,  hp];

    await db.query(query, values);
}

export async function update(userid, username, guardianHp, hp) {
    const query = 'UPDATE user SET username = ?, guardianHp = ?, hp = ? WHERE userid = ?';
    const values = [username, guardianHp, hp, userid];

    await db.query(query, values);
}

export async function remove(userid) {
    const values = [userid];

    
    // 외래키 때문에 게시물 먼저 삭제해야함.
    const board_del = 'delete from board where userid=?';
    await db.query(board_del, values);

    const query = 'DELETE FROM user WHERE userid = ?';
    await db.query(query, values);
}

export async function deleteboard(post_id){
    return db.execute('delete from board where post_id=?', [post_id])
    .then((result) => console.log(result[0]))
}
