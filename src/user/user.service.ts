import bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../dto/user.dto';
import { AppError } from '../util/AppError';
import { generateToken } from '../util/jwt';
import { userRepository } from '../repository/user.repository';
import { sendMail } from '../util/mailer'; // 이메일 전송 함수


// 스토리지에 저장 함 새로고침 시 날라가버림 방법 찾아야함
const verificationCodeStorage: { [email: string]: { code: string, expiresAt: number } } = {};

export const userService = {
    verificationCode: async(email: string) => {
        // 이메일코드 재발송 방지
        const emailChk = await userRepository.findUserByEmail(email);
        if (emailChk) throw new AppError("이미 존재하는 이메일입니다.", 400);
        
        if (verificationCodeStorage[email]) {
            const storedData = verificationCodeStorage[email];
            if (storedData.expiresAt > Date.now()) {
                throw new AppError("이미 인증코드가 발송되었습니다", 400);
            }
        }
        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
        // 5분 유효
        const expiresAt = Date.now() + 5 * 60 * 1000;

        verificationCodeStorage[email] = { code: verificationCode, expiresAt };

        await sendMail(email, '이메일 인증 코드입니다.', `인증코드는: ${verificationCode}`);
        return email;
    },
    passwordResetLink: async(email: string, link: string) => {
        const user = await userRepository.findUserByEmail(email);
        if(!user) throw new AppError("이메일이 존재하지않습니다.", 400);
        await sendMail(email, "비밀번호 재설정 페이지", `Link: ${link}`);
        return email;
    },
    passwordReset: async(email: string, password: string) =>{
        const user = await userRepository.findUserByEmail(email);
        if(!user) throw new AppError("이메일이 존재하지않습니다.", 400);

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        
        await userRepository.updateUser(user);
        return;
    },
    signUp: async (createUserDto: CreateUserDto, code: string) => {
        const { name, email, password } = createUserDto;

        if (!name || !email || !password) {
            throw new AppError('입력값 에러: 모든 필드는 필수입니다.', 400);
        }
        const storedData = verificationCodeStorage[createUserDto.email];
            
        if (!storedData || storedData.expiresAt < Date.now()) {
            throw new AppError("인증 코드가 만료되었거나 유효하지 않습니다.", 400);
        }

        if (storedData.code !== code) {
            throw new AppError("유효한 코드를 입력해주세요.", 400);
        }

        delete verificationCodeStorage[createUserDto.email];

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

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