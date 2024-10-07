import express, { Express} from "express";
import { AppDataSource } from './util/db'; // 경로를 맞게 조정
import dotenv from 'dotenv';
import { userRouter } from './user/user.router'; 

//.env 파일 불러오기
dotenv.config();
const app: Express = express();

// 미들웨어 설정
app.use(express.json());

app.use('/users', userRouter);

//데이터 베이스 및 서버 연결
AppDataSource.initialize()
    .then(() => {
        console.log("데이터베이스에 연결되었습니다.");
        // 서버를 실행하는 코드
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`서버가 ${PORT}에서 실행 중입니다.`);
        });
    })
    .catch((error) => console.log("데이터베이스 연결 오류:", error));