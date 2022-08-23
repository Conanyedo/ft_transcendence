import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [UserModule, TypeOrmModule.forRoot({
		type: 'postgres',
		host: '127.0.0.1',
		port: 5432,
		username: 'Conanyedo',
		password: 'nestjs',
		database: 'nestjs',
		// entities: [User],
		autoLoadEntities: true,
		synchronize: true,
		// logging: true, // log sql queries
	}), AuthModule]
})
export class AppModule { }
