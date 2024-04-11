import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('servers', { schema: 'mysql' })
export class servers extends BaseEntity {
  @Column('char', { primary: true, name: 'Server_name', length: 64 })
  serverName: string;

  @Column('char', { name: 'Host', length: 255 })
  host: string;

  @Column('char', { name: 'Db', length: 64 })
  db: string;

  @Column('char', { name: 'Username', length: 64 })
  username: string;

  @Column('char', { name: 'Password', length: 64 })
  password: string;

  @Column('int', { name: 'Port', default: () => '\'0\'' })
  port: number;

  @Column('char', { name: 'Socket', length: 64 })
  socket: string;

  @Column('char', { name: 'Wrapper', length: 64 })
  wrapper: string;

  @Column('char', { name: 'Owner', length: 64 })
  owner: string;
}
