import bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../dto/user.dto';
import { AppError } from '../util/AppError';
import { generateToken } from '../util/jwt';
import { userRepository } from '../repository/user.repository';

export const userService = {
    signUp: async (createUserDto: CreateUserDto) => {
        const { name, email, password } = createUserDto;

        if (!name || !email || !password) {
            throw new AppError('입력값 에러: 모든 필드는 필수입니다.', 400);
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 이메일 중복 체크
        const existingUser = await userRepository.findUserByEmail(email);
        if (existingUser) {
            throw new AppError('이미 사용 중인 이메일입니다.', 409);
        }

        // 사용자 생성
        await userRepository.createUser({
            name,
            email,
            password: hashedPassword,
        });

        return;
    },

    signIn: async (loginDto: LoginUserDto) => {
        const { email, password } = loginDto;

        if (!email || !password) {
            throw new AppError('입력값 에러: 모든 필드는 필수입니다.', 400);
        }

        // 사용자 찾기
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            throw new AppError('사용자를 찾을 수 없습니다', 400);
        }

        // 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError('잘못된 비밀번호입니다.', 400);
        }

        // JWT 생성
        const token = generateToken(user.uuid);

        return { token };
    },
    updateUser: async(userId: string, updateUserdto: UpdateUserDto) => {
        const user = await userRepository.findByUser(userId);
        if(!user) throw new AppError("사용자를 찾을 수 없습니다.", 404);
        Object.assign(user, updateUserdto);
        await userRepository.updateUser(user);
    },
    deleteUser: async(userId: string) => {
        const user = await userRepository.deleteUser(userId);
        if (user.affected === 0) throw new AppError('사용자를 찾을 수 없습니다.', 404);
    },
};