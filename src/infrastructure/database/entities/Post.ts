import { BaseEntity, Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Blog } from './Blog';

@Entity('posts')
export class Post extends BaseEntity {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column({ nullable: true })
  title?: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  viewCount: number = 0;

  @ManyToOne(() => Blog, (blog) => blog.posts)
  blog: Blog;
}
