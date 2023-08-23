import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import adminRouter from './router/admin.js';
import userRouter from  "./router/user.js"
import dreamRouter from "./router/dream.js"
import { config } from './config.js';
// import kakaoRouter from "./router/kakao.js"
import morgan from 'morgan';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("tiny")); // 요청온거 확인하게 
app.use("/admin", adminRouter);  // admin
app.use("/user", userRouter); // admin에서 회원관리 
app.use("/safedream", dreamRouter); //사용자 



app.listen(config.host.port, () => {
    console.log(`Server is running on port ${config.host.port}`);
});
