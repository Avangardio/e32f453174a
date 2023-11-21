import Tokens from "@/Modules/redis/classes/TokensRepo";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class RedisService {
  constructor(public readonly regBlock: Tokens) {
  }
}
