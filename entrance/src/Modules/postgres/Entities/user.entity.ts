// user.entity.ts

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "@/Modules/postgres/Entities/post.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  userid: number;

  @Column({ unique: true })
  email: string;

  @Column()
  hash: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
