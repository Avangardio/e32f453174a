import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import PostgresService from "@/Modules/postgres/postgres.service";
import { User } from "@/Modules/postgres/Entities/user.entity";
import UserRepo from "@/Modules/postgres/repositories/userRepo";
import UserService from "@/Modules/postgres/user.service";
import PostRepo from "@/Modules/postgres/repositories/postRepo";
import { Post } from "@/Modules/postgres/Entities/post.entity";
import PostService from "@/Modules/postgres/post.service";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const postgresConfig = configService.get("postgres");
        const redisConfig = configService.get("redis");
        return {
          type: "postgres",
          host: postgresConfig.host,
          port: postgresConfig.port,
          username: postgresConfig.username,
          password: postgresConfig.password,
          database: postgresConfig.database,
          entities: [User, Post],
          synchronize: false,
          cache: {
            type: "ioredis",
            options: {
              host: redisConfig.host,
              port: redisConfig.port
            }
          }
        };
      },
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([User, Post])
  ],
  providers: [PostgresService, UserService, UserRepo, PostService, PostRepo],
  exports: [PostgresService]
})
export class PostgresModule {
}
