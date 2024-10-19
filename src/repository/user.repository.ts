// User 엔티티 import
import { User } from '../entity/user.entity'; 
import { AppDataSource } from '../config/db';
import { NotFoundError } from '../util/AppError';

const repository = AppDataSource.getRepository(User);

export const userRepository = {
    getUserByName : async (username: string): Promise<{ uuid: string, name: string;} | null> => {
        const user = await repository.findOne({
            where: { name: username }
        });
        if (!user) {
            throw new NotFoundError(`사용자를 찾을 수 없습니다: ${username}`);
        }
        return {uuid: user.uuid, name: user.name};
    },
    getUserByUuid : async (uuid: string) => {
        const user = await repository.findOne({
            where: { uuid: uuid }
        });
        return user;
    },
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
        .select(["user.email", "user.name", "image.imgAddr"])
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