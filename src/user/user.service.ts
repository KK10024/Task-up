import {User} from '../entity/user.entity';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { AppDataSource } from '../util/db';
import bcrypt from 'bcrypt';
import { generateToken } from '../util/jwt';

export const userService = {
    signUp: async (createUserDto: CreateUserDto) => {
        const {name, email, password} = createUserDto;
        
        if(!name || !email || !password) throw new Error('입력값 에러');

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRepository = AppDataSource.getRepository(User);

        const newUser = userRepository.create({
            name,
            email,
            password: hashedPassword,
          });
        userRepository.save(newUser);

        return newUser;
    },
    signIn: async (loginDto: LoginUserDto) => {
        const { email, password } = loginDto;

        if (!email || !password) throw new Error('입력값 에러');

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) throw new Error('사용자를 찾을 수 없습니다.');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error('잘못된 비밀번호입니다.');

        // JWT 생성
        const token = generateToken(user.id);

        // 로그인 성공 시 사용자 정보와 토큰 반환
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },token};
    },
};