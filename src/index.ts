import express, { Express} from "express";
import { AppDataSource } from './config/db'; // 경로를 맞게 조정
import dotenv from 'dotenv';
import { userRouter } from './user/user.router'; 
import { errorHandler } from './middleware/errorHandler'; // 에러 처리 미들웨어 가져오기

//.env 파일 불러오기
dotenv.config();

const app: Express = express();

//에러 핸들러 설정
// 미들웨어 설정
app.use(express.json());

//user 라우터 연결
app.use('/users', userRouter);

app.use(errorHandler)

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