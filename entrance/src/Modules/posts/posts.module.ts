import { Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { GuardsModule } from "@/Guards/guards.module";
import { PostgresModule } from "@/Modules/postgres/postgres.module";

@Module({
  imports: [GuardsModule, PostgresModule],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {
}
