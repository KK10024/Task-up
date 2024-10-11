import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/user.entity";
import { Task } from "../entity/task.entity";
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false, // 개발 환경에서는 true, 프로덕션에서는 false로 설정
    logging: false,
    entities: [User, Task],
    migrations: [],
    subscribers: [],
});