import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { Post } from './Post';

/**
 * Such entities are database models which represents certain domain ones. Aggregates are in the transaction
 * boundary, thus they should be treated as a single entity from the transactional point of view. As such aggregates
 * contain multiple different fields, they should be normalized and stored in couple of separate tables, which is done
 * within database models.
 */
@Entity('blogs')
export class Blog extends BaseEntity {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Post, (post) => post.blog, { cascade: true })
  posts: Post[];
}
