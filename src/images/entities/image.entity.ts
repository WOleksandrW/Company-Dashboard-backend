import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from 'src/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/companies/entities/company.entity';

@Entity()
export class Image extends Base {
  @Column({ type: 'bytea' })
  data: Buffer;

  @Column()
  mimeType: string;

  @OneToOne(() => User, (user) => user.image, { nullable: true })
  @JoinColumn()
  user: User;

  @OneToOne(() => Company, (company) => company.image, { nullable: true })
  @JoinColumn()
  company: Company;
}
