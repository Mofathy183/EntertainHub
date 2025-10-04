import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AnimeModule } from './anime/anime.module';
// import { SeedService } from './seed/seed.service';
// import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MongoDB_URL ||
        'mongodb://localhost:27017/entertainment_wave_DB',
    ),
    // AnimeModule,
    // SeedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // SeedService
  ],
})
export class AppModule {}
