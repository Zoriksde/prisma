import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { Post } from './Post';

@Entity('blogs')
export class Blog extends BaseEntity {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @OneToMany(() => Post, (post) => post.blog, { cascade: true })
  posts: Post[];
}
