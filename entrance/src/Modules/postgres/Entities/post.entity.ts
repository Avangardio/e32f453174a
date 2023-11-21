// post.entity.ts

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn({ name: "postid" })
  postId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ name: "authorid" })
  authorId: number;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "authorid" })
  author: User;
}
