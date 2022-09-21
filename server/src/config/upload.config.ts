import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { userParitalDto } from 'src/user/user.dto';

export const uploadUsersConfig: MulterOptions = {
	storage: diskStorage({
		destination: '../client/public/uploads/users',
		filename: (req, file, callback) => {
			const user: userParitalDto = <userParitalDto>req.user;
			const fileName = `${user.login + Date.now()}.jpg`
			callback(null, fileName);
		}
	})
}

export const uploadChannelConfig: MulterOptions = {
	storage: diskStorage({
		destination: '../client/public/uploads/channels',
		filename: (req, file, callback) => {
			const fileName = `${req.body.convId + Date.now()}.jpg`
			callback(null, fileName);
		}
	})
}