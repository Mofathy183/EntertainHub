import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnimeSeeder } from './seed.service';
import { animeModels } from './data/anime.data';

seeder({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				uri: configService.get<string>('MongoDB_URL'),
			}),
		}),
		MongooseModule.forFeature([...animeModels]),
	],
}).run([AnimeSeeder]);
