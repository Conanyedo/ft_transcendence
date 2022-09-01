import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { userParitalDto } from 'src/user/user.dto';

export const uploadConfig: MulterOptions = {
	storage: diskStorage({
		destination: './uploads',
		filename: (req, file, callback) => {
			const user: userParitalDto = <userParitalDto>req.user;
			const fileName = `${user.login}.jpg`
			callback(null, fileName);
		}
	})
}