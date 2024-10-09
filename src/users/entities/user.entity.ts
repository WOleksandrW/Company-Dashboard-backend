import { Column, Entity } from 'typeorm';
import { Base } from 'src/entities/base.entity';

@Entity()
export class User extends Base {
  @Column({ type: 'varchar', length: 15, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 40, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: ['USER', 'ADMIN', 'SUPER-ADMIN'] })
  role: string;
}
