import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
		const config: TypeOrmModuleOptions = {
			type: 'postgres',
			host: configService.get<string>('DB_HOST'),
			port: +configService.get<string>('DB_PORT'),
			username: configService.get<string>('DB_USERNAME'),
			password: <string>configService.get<string>('DB_PASSWORD'),
			database: configService.get<string>('DB_NAME'),
			autoLoadEntities: true,
			synchronize: true,
			// logging: true
		}
		return config;
	},
}