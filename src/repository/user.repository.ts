// User 엔티티 import
import { User } from '../entity/user.entity'; 
import { AppDataSource } from '../config/db';
import { AppError } from '../util/AppError';


export const userRepository = {
getUserByName : async (username: string): Promise<string | null> => {
    const repository = AppDataSource.getRepository(User);
    const user = await repository.findOne({
        where: { name: username }
    });
    if (!user) {
        throw new AppError(`사용자를 찾을 수 없습니다: ${username}`, 404);
    }
    return user.name;
},
// 이메일로 사용자 찾기
findUserByEmail: async (email: string): Promise<User | null> => {
    const repository = AppDataSource.getRepository(User);
    return await repository.findOne({ where: { email } });
},
createUser: async (user: Partial<User>): Promise<User> => {
    const repository = AppDataSource.getRepository(User);
    const newUser = repository.create(user);
    return await repository.save(newUser);
},
findByUser: async (user_id: string) => {
    const repository = AppDataSource.getRepository(User);
    return repository.findOne({where: {uuid : user_id}});
},
updateUser: async (user: User) => {
    const repository = AppDataSource.getRepository(User);
    return await repository.save(user);
},
}