import { Column, Entity } from 'typeorm';
import { Base } from 'src/entities/base.entity';

@Entity()
export class Image extends Base {
  @Column({ type: 'bytea' })
  data: Buffer;

  @Column()
  mimeType: string;
}
