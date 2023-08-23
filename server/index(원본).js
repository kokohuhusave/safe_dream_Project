// 필요한 모듈을 가져옵니다.
import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import mysql from 'mysql2';
import cors from 'cors';


// Express 애플리케이션을 생성합니다.
const app = express();

// 요청의 본문을 파싱하기 위한 미들웨어를 등록합니다.
app.use(bodyParser.json());
app.use(cors());

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'myapp'
});

// MySQL에 연결합니다.
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// 로그인 요청을 처리하는 핸들러를 등록합니다.
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // MySQL에서 사용자 정보를 조회합니다.
  const query = 'SELECT*FROM users WHERE username=?';
  connection.query(query, [username], (err, results) => {
    if (err) throw err;
    console.log(results);
    

    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
    } else {
      // 비밀번호를 비교합니다.
      const user = results[0];
      bcrypt.compare(password, user.password, (err, match) => {
        if (err) throw err;

        if (password === user.password) {
          res.json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Invalid username or password' });
        }
      });
    }
  });
});

// 서버를 시작합니다.
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
