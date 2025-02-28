import express, { Express} from "express";
import cookieParser from 'cookie-parser';
import { AppDataSource } from './config/db';
import dotenv from 'dotenv';
import { userRouter } from './user/user.router'; 
import { errorHandler } from './middleware/errorHandler';
import { taskRouter } from "./task/task.router";
import { scheduleNotifications } from './util/task.sheduler';
import { sseHandler } from "./middleware/sseHandler";
import path from 'path';
import cors from 'cors';

dotenv.config();

const app: Express = express();

//cors 설정
app.use(
	cors({
	  origin: "http://kdt-react-node-1-team03.elicecoding.com",
	  credentials: true
    }),
   );
//테스트

// 알림 스케쥴러 등록
scheduleNotifications();
// 쿠키 파싱
app.use(cookieParser());

//이미지 파일
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 미들웨어 설정
app.use(express.json());

app.get('/events', sseHandler);

//user 라우터 연결
app.use("/user", userRouter);
app.use('/tasks', taskRouter);

//에러 핸들러 설정
app.use(errorHandler)

//데이터 베이스 및 서버 연결
AppDataSource.initialize()
    .then(() => {
        console.log("데이터베이스에 연결되었습니다.");
        // 서버를 실행하는 코드
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`서버가 ${PORT}에서 실행 중입니다.`);
        });
    })
    .catch((error) => console.log("데이터베이스 연결 오류:", error));
