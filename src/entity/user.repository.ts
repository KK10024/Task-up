// User 엔티티 import
import { User } from '../entity/user.entity'; 
import { AppDataSource } from '../config/db';

// 사용자 이름으로 UUID 가져오기
export const getUserUUIDByName = async (username: string): Promise<string | null> => {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
        where: { name: username } // 이름으로 검색
    });

    return user ? user.uuid : null; // 사용자가 있으면 UUID 반환, 없으면 null 반환
}