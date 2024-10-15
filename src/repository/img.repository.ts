import { Iimg } from "src/dto/img.dto";
import { AppDataSource } from "../config/db";
import { Image } from "../entity/img.entity";

const repository = AppDataSource.getRepository(Image);

export const ImgRepository = {
    imgUpload: async (newImg: Iimg) => {
        const img = repository.create(newImg);
        const savedImg = await repository.save(img);
        return savedImg.id;
    }
}
