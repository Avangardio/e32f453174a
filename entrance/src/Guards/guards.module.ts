import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtGuard } from "@/Guards/jwt.guard";
import { JwtServiceRoot } from "@/Guards/jwt.service";
import { RefreshGuard } from "@/Guards/refresh.guard";
import { RedisDBModule } from "@/Modules/redis/redis.module";

@Module({
  imports: [
    RedisDBModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT"),
        signOptions: { expiresIn: "3min" }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [JwtGuard, JwtServiceRoot, RefreshGuard],
  exports: [JwtGuard, JwtServiceRoot, RefreshGuard]
})
export class GuardsModule {
}
