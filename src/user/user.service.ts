import bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../dto/user.dto';
import { AppError, BadReqError } from '../util/AppError';
import { generateToken } from '../util/jwt';
import { userRepository } from '../repository/user.repository';
import { sendMail } from '../util/mailer'; // 이메일 전송 함수
import { ImgRepository } from '../repository/img.repository';
import { Iimg } from '../dto/img.dto';
import { ImgType } from '../entity/img.types';
import { Image } from 'src/entity/img.entity';
import dayjs from 'dayjs';
import crypto from 'crypto';


const verificationData: { [email: string]: { code: string, expiresAt: number } } = {};

const resetPwData: { [email: string]: { resetToken: string, expiresAt: number } } = {};

export const userService = {
    verificationCode: async(email: string) => {
        // 이메일코드 재발송 방지
        const emailChk = await userRepository.findUserByEmail(email);
        if (emailChk) throw new BadReqError("이미 존재하는 이메일입니다.");
        
        if (verificationData[email]) {
            const storedData = verificationData[email];
            if (storedData.expiresAt > Date.now()) {
                throw new AppError("이미 인증코드가 발송되었습니다", 400);
            }
        }
        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
        // 5분 유효
        const expiresAt = Date.now() + 5 * 60 * 1000;

        verificationData[email] = { code: verificationCode, expiresAt };

        await sendMail(email, '이메일 인증 코드입니다.', `인증코드: ${verificationCode}`);
        return email;
    },
    passwordResetLink: async(email: string) => {
        const user = await userRepository.findUserByEmail(email);
        if(!user) throw new AppError("이메일이 존재하지않습니다.", 400);

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = dayjs().add(10, 'minute').toDate().valueOf();

        resetPwData[email] = { resetToken: resetToken, expiresAt};
        const resetLink = `http://localhost:3000?token=${resetToken}&email=${email}`;
        const htmlLink = `<p><a href="${resetLink}">비밀번호 재설정 링크</a></p>`;

        await sendMail(email, "비밀번호 재설정 페이지", htmlLink);
        return email;
    },
    passwordReset: async(email: string, token: string, password: string, confirmPassword: string) =>{
        if(password !== confirmPassword) throw new AppError("패스워드가 일치하지 않습니다", 400);

        const user = await userRepository.findUserByEmail(email);
        if(!user) throw new AppError("이메일이 존재하지않습니다.", 400);

        const resetData = resetPwData[email];
        
        if (!resetData || resetData.expiresAt < Date.now()) {
            throw new AppError("인증 토큰이 만료되었거나 유효하지 않습니다.", 400);
        }

        if (resetData.resetToken !== token) {
            throw new AppError("유효한 토큰이 아닙니다.", 400);
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
    
        await userRepository.updateUser(user);

        delete resetPwData[email];

        return;
    },
    signUp: async (createUserDto: CreateUserDto, code: string) => {
        const { name, email, password } = createUserDto;

        if (!name || !email || !password) {
            throw new AppError('입력값 에러: 모든 필드는 필수입니다.', 400);
        }
        const storedData = verificationData[createUserDto.email];
            
        if (!storedData || storedData.expiresAt < Date.now()) {
            throw new AppError("인증 코드가 만료되었거나 유효하지 않습니다.", 400);
        }

        if (storedData.code !== code) {
            throw new AppError("유효한 코드를 입력해주세요.", 400);
        }

        delete verificationData[createUserDto.email];

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
    getUserProfile: async(userId: string) =>{
        const user = await userRepository.getUserProfile(userId);
        const profileImageUrl = user.profileImage.imgAddr.replace(/\\/g, '/');
        return {
            email: user.email,
            name: user.name,
            profileImage: `${process.env.BASE_URL}/${profileImageUrl}`,
        };
    },
    updateUser: async(userId: string, imagePath: string, updateUserdto: UpdateUserDto) => {
        const user = await userRepository.findByUser(userId);
        if(!user) throw new AppError("사용자를 찾을 수 없습니다.", 404);
        const newImage: Iimg = {
            type: ImgType.USER,
            imgAddr: imagePath,
        };
        const imgId = await ImgRepository.imgUpload(newImage);
        user.profileImage = {id :imgId} as Image
        Object.assign(user, updateUserdto);
        await userRepository.updateUser(user);
    },
    deleteUser: async(userId: string) => {
        const user = await userRepository.deleteUser(userId);
        if (user.affected === 0) throw new AppError('사용자를 찾을 수 없습니다.', 404);
    },
};