import { Column, Entity } from 'typeorm';
import { Base } from 'src/entities/base.entity';

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
}
