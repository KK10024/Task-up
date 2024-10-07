import { IsEmail, IsNotEmpty } from 'class-validator';


export class CreateUserDto {
    @IsNotEmpty({message: '이름은 필수 항목입니다.'})
    name: string;

    @IsEmail({}, { message: '유효한 이메일 주소여야 합니다.' })
    email: string;

    @IsNotEmpty({ message: '비밀번호는 필수 항목입니다.' })
    password: string;
};
export class LoginUserDto {
    email: string;
    password: string;
    constructor(email:string, password:string){
        this.email = email;
        this.password = password;
    }
};