import multer, { StorageEngine } from 'multer';
import path from 'path';

// 저장 설정
const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/imgs'); // 이미지 파일이 저장될 경로
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); 
    }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png|gif/; // 허용할 파일 확장자
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: 파일 형식이 올바르지 않습니다.'));
    }
};

// 최대 파일 크기 설정 (5MB)
const limits = {
    fileSize: 5 * 1024 * 1024 // 5MB
};

// Multer 설정
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});