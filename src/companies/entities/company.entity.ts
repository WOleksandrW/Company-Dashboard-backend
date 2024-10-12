import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Base } from 'src/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Image } from 'src/images/entities/image.entity';

@Entity()
export class Company extends Base {
  @Column({ type: 'varchar', length: 30, unique: true })
  title: string;

  @Column({ type: 'varchar', length: 30 })
  service: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'int' })
  capital: number;

  @ManyToOne(() => User, (user) => user.companies, { nullable: false })
  user: User;

  @OneToOne(() => Image, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  image: Image;
}
