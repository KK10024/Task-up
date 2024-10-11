import { IsEmail, IsNotEmpty, Matches , Length, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: '이름 필드는 필수값입니다.' })
    @Length(2, 10, { message: '이름은 최소 2자 이상, 최대 10자 이하이어야 합니다.' })
    name: string;

    @IsNotEmpty({ message: '이메일 필드는 필수값입니다.' })
    @IsEmail({}, { message: '유효한 이메일 주소를 입력하세요.' })
    email: string;

    @IsNotEmpty({ message: '비밀번호 필드는 필수값입니다.' })
    @Length(8, undefined, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    password: string;
}

export class LoginUserDto {
    @IsNotEmpty({ message: '이메일 필드는 필수값입니다.' })
    @Matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // 이메일 정규식
        { message: '유효한 이메일 주소를 입력하세요.' }
    )    
    email: string;

    @IsNotEmpty({ message: '비밀번호 필드는 필수값입니다.' })
    @Length(8, undefined, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    password: string;
}
export class UpdateUserDto {
    @IsOptional()
    @Length(2, 10, { message: '이름은 최소 2자 이상, 최대 10자 이하이어야 합니다.' })
    name?: string;

    @IsOptional()
    @IsEmail({}, { message: '유효한 이메일 주소를 입력하세요.' })
    email?: string;

    @IsOptional()
    @Length(8, undefined, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    password?: string;
}