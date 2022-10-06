import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { userParitalDto } from 'src/user/user.dto';
import { fromStream } from 'file-type/core';

import * as fs from 'fs';
import * as path from 'path';
import * as Jimp from 'jimp';
import { exec } from 'child_process';

const validFileExtensions: string[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes: string[] = ['image/png', 'image/jpg', 'image/jpeg'];

export const uploadUsersConfig: MulterOptions = {
	storage: diskStorage({
		destination: './uploads/users',
		filename: (req, file, callback) => {
			const user: userParitalDto = <userParitalDto>req.user;
			const ext = path.extname(file.originalname);
			const fileName = `${user.login + Date.now()}` + ext;
			callback(null, fileName);
		}
	}),
	fileFilter: (req, file, callback) => {
		if (!validMimeTypes.includes(file.mimetype))
			callback(null, false);
		else
			callback(null, true);
	}
}

export const uploadChannelConfig: MulterOptions = {
	storage: diskStorage({
		destination: './uploads/channels',
		filename: (req, file, callback) => {
			const ext = path.extname(file.originalname);
			const fileName = `${req.body.convId + Date.now()}` + ext;
			callback(null, fileName);
		},
	}),
	fileFilter: (req, file, callback) => {
		if (!validMimeTypes.includes(file.mimetype))
			callback(null, false);
		else
			callback(null, true);
	}
}

export const isFileValid = async (uploadPath: string, name: string) => {
	const stream = fs.createReadStream(`./uploads/${uploadPath}/${name}`);
	const fileType = await fromStream(stream);
	const isValid: boolean = validFileExtensions.includes(fileType.ext) && validMimeTypes.includes(fileType.mime);
	if (!isValid) {
		fs.unlink(`./uploads/${uploadPath}/${name}`, (err) => { });
		return undefined;
	}
	return name;
}

export const deleteAvatar = async (uploadPath: string, name: string) => {
	if (name)
		fs.unlink(`./uploads/${uploadPath}/${name}`, (err) => { });
}

export const deleteOldAvatar = async (uploadPath: string, name: string) => {
	const ext = path.extname(name);
	let oldName = name.split('/').pop();
	oldName = oldName.slice(0, oldName.indexOf(ext));
	deleteAvatar(uploadPath, `${oldName}x70${ext}`);
	deleteAvatar(uploadPath, `${oldName}x220${ext}`);
}

export const resizeAvatar = async (uploadPath: string, name: string) => {
	const ext = path.extname(name);
	const image = await Jimp.read(`./uploads/${uploadPath}/${name}`);
	const resizeName = name.slice(0, name.indexOf(ext));
	image.resize(220, 220).write(`./uploads/${uploadPath}/${resizeName}x220${ext}`);
	image.resize(70, 70).write(`./uploads/${uploadPath}/${resizeName}x70${ext}`);
	deleteAvatar(uploadPath, name);
}