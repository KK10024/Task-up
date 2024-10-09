import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/user.entity";
import { Task } from "../entity/task.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "1234",
    database: "TaskUp",
    synchronize: true, // 개발 환경에서는 true, 프로덕션에서는 false로 설정
    logging: false,
    entities: [User, Task],
    migrations: [],
    subscribers: [],
});