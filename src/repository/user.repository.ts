// User 엔티티 import
import { User } from '../entity/user.entity'; 
import { AppDataSource } from '../config/db';
import { AppError } from '../util/AppError';

const repository = AppDataSource.getRepository(User);

export const userRepository = {
    // 이름으로 검색 후 uuid, name 내보냄
    getUserByName : async (username: string): Promise<{ uuid: string, name: string;} | null> => {
        const user = await repository.findOne({
            where: { name: username }
        });
        if (!user) {
            throw new AppError(`사용자를 찾을 수 없습니다: ${username}`, 404);
        }
        return {uuid: user.uuid, name: user.name};
    },
    //uuid 로 이름 검색하는 부분 (uuid 만 저장 할 경우 필요)
    // getUserByUuid : async (uuid : string): Promise<{name: string} | null> => {
    //     const repository = AppDataSource.getRepository(User);
    //     const user = await repository.findOne({
    //         where: { uuid: uuid }
    //     });
    //     if (!user) {
    //         return null;
    //     }
    //     return {name: user.name};
    // },
    findUserByEmail: async (email: string): Promise<User | null> => {
        return await repository.findOne({ where: { email } });
    },
    createUser: async (user: Partial<User>): Promise<User> => {
        const newUser = repository.create(user);
        return await repository.save(newUser);
    },
    findByUser: async (userId: string) => {
        return repository.findOne({where: {uuid : userId}});
    },
    getUserProfile: async(userId : string) => {
        return repository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.profileImage", "image")
        .select(["user.name", "image.imgAddr"])
        .where("user.uuid = :id", { id: userId })
        .getOne();
    },
    updateUser: async (user: User) => {
        return await repository.save(user);
    },
    deleteUser: async (user_id: string) => {
        return await repository.softDelete(user_id);
    },
}