import { BaseEntity, Column, Entity } from 'typeorm'

@Entity('slave_worker_info', { schema: 'mysql' })
export class slave_worker_info extends BaseEntity {
  @Column('int', { primary: true, name: 'Id', unsigned: true })
  id: number

  @Column('text', { name: 'Relay_log_name' })
  relayLogName: string

  @Column('bigint', { name: 'Relay_log_pos', unsigned: true })
  relayLogPos: string

  @Column('text', { name: 'Master_log_name' })
  masterLogName: string

  @Column('bigint', { name: 'Master_log_pos', unsigned: true })
  masterLogPos: string

  @Column('text', { name: 'Checkpoint_relay_log_name' })
  checkpointRelayLogName: string

  @Column('bigint', { name: 'Checkpoint_relay_log_pos', unsigned: true })
  checkpointRelayLogPos: string

  @Column('text', { name: 'Checkpoint_master_log_name' })
  checkpointMasterLogName: string

  @Column('bigint', { name: 'Checkpoint_master_log_pos', unsigned: true })
  checkpointMasterLogPos: string

  @Column('int', { name: 'Checkpoint_seqno', unsigned: true })
  checkpointSeqno: number

  @Column('int', { name: 'Checkpoint_group_size', unsigned: true })
  checkpointGroupSize: number

  @Column('blob', { name: 'Checkpoint_group_bitmap' })
  checkpointGroupBitmap: Buffer

  @Column('varchar', {
    primary: true,
    name: 'Channel_name',
    comment:
      'The channel on which the replica is connected to a source. Used in Multisource Replication',
    length: 64,
  })
  channelName: string
}
