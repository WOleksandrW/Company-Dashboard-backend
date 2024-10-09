import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Base } from 'src/entities/base.entity';
import { Company } from 'src/companies/entities/company.entity';
import { Image } from 'src/images/entities/image.entity';
import { ERole } from 'src/enums/ERole';

@Entity()
export class User extends Base {
  @Column({ type: 'varchar', length: 15, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 40, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: ERole })
  role: string;

  @OneToMany(() => Company, (company) => company.user)
  companies: Company[];

  @OneToOne(() => Image, (image) => image.user, { nullable: true })
  @JoinColumn()
  image: Image;
}
