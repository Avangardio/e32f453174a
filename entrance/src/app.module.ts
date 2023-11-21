import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AuthModule } from './Modules/auth/auth.module';
import { GuardsModule } from '@/Guards/guards.module';
import { PostsModule } from '@/Modules/posts/posts.module';

@Module({
  imports: [
    PostsModule,
    GuardsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
      expandVariables: true,
    }),
  ],
})
export class AppModule {}
