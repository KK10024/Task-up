// User 엔티티 import
import { User } from '../entity/user.entity'; 
import { AppDataSource } from '../config/db';

export const userRepository = AppDataSource.getRepository(User);

export const getUserByName = async (username: string): Promise<string | null> => {
    const user = await userRepository.findOne({
        where: { name: username }
    });
    return user ? user.name : null; 
}

// 이메일로 사용자 찾기
export const findUserByEmail = async (email: string): Promise<User | null> => {
    return await userRepository.findOne({ where: { email } });
};

// 사용자 생성
export const createUser = async (user: Partial<User>): Promise<User> => {
    const newUser = userRepository.create(user);
    return await userRepository.save(newUser);
};