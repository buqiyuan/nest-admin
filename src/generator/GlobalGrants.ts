import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('global_grants', { schema: 'mysql' })
export class global_grants extends BaseEntity {
  @Column('char', { primary: true, name: 'USER', length: 32 })
  user: string;

  @Column('char', { primary: true, name: 'HOST', length: 255 })
  host: string;

  @Column('char', { primary: true, name: 'PRIV', length: 32 })
  priv: string;

  @Column('enum', {
    name: 'WITH_GRANT_OPTION',
    enum: ['N', 'Y'],
    default: () => '\'N\'',
  })
  withGrantOption: 'N' | 'Y';
}
