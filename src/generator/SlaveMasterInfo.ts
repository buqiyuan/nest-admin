import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('slave_master_info', { schema: 'mysql' })
export class slave_master_info extends BaseEntity {
  @Column('int', {
    name: 'Number_of_lines',
    comment: 'Number of lines in the file.',
    unsigned: true,
  })
  numberOfLines: number;

  @Column('text', {
    name: 'Master_log_name',
    comment:
      'The name of the master binary log currently being read from the master.',
  })
  masterLogName: string;

  @Column('bigint', {
    name: 'Master_log_pos',
    comment: 'The master log position of the last read event.',
    unsigned: true,
  })
  masterLogPos: string;

  @Column('varchar', {
    name: 'Host',
    nullable: true,
    comment: 'The host name of the source.',
    length: 255,
  })
  host: string | null;

  @Column('text', {
    name: 'User_name',
    nullable: true,
    comment: 'The user name used to connect to the master.',
  })
  userName: string | null;

  @Column('text', {
    name: 'User_password',
    nullable: true,
    comment: 'The password used to connect to the master.',
  })
  userPassword: string | null;

  @Column('int', {
    name: 'Port',
    comment: 'The network port used to connect to the master.',
    unsigned: true,
  })
  port: number;

  @Column('int', {
    name: 'Connect_retry',
    comment:
      'The period (in seconds) that the slave will wait before trying to reconnect to the master.',
    unsigned: true,
  })
  connectRetry: number;

  @Column('tinyint', {
    name: 'Enabled_ssl',
    comment: 'Indicates whether the server supports SSL connections.',
    width: 1,
  })
  enabledSsl: boolean;

  @Column('text', {
    name: 'Ssl_ca',
    nullable: true,
    comment: 'The file used for the Certificate Authority (CA) certificate.',
  })
  sslCa: string | null;

  @Column('text', {
    name: 'Ssl_capath',
    nullable: true,
    comment: 'The path to the Certificate Authority (CA) certificates.',
  })
  sslCapath: string | null;

  @Column('text', {
    name: 'Ssl_cert',
    nullable: true,
    comment: 'The name of the SSL certificate file.',
  })
  sslCert: string | null;

  @Column('text', {
    name: 'Ssl_cipher',
    nullable: true,
    comment: 'The name of the cipher in use for the SSL connection.',
  })
  sslCipher: string | null;

  @Column('text', {
    name: 'Ssl_key',
    nullable: true,
    comment: 'The name of the SSL key file.',
  })
  sslKey: string | null;

  @Column('tinyint', {
    name: 'Ssl_verify_server_cert',
    comment: 'Whether to verify the server certificate.',
    width: 1,
  })
  sslVerifyServerCert: boolean;

  @Column('float', { name: 'Heartbeat', precision: 12 })
  heartbeat: number;

  @Column('text', {
    name: 'Bind',
    nullable: true,
    comment:
      'Displays which interface is employed when connecting to the MySQL server',
  })
  bind: string | null;

  @Column('text', {
    name: 'Ignored_server_ids',
    nullable: true,
    comment:
      'The number of server IDs to be ignored, followed by the actual server IDs',
  })
  ignoredServerIds: string | null;

  @Column('text', {
    name: 'Uuid',
    nullable: true,
    comment: 'The master server uuid.',
  })
  uuid: string | null;

  @Column('bigint', {
    name: 'Retry_count',
    comment: 'Number of reconnect attempts, to the master, before giving up.',
    unsigned: true,
  })
  retryCount: string;

  @Column('text', {
    name: 'Ssl_crl',
    nullable: true,
    comment: 'The file used for the Certificate Revocation List (CRL)',
  })
  sslCrl: string | null;

  @Column('text', {
    name: 'Ssl_crlpath',
    nullable: true,
    comment: 'The path used for Certificate Revocation List (CRL) files',
  })
  sslCrlpath: string | null;

  @Column('tinyint', {
    name: 'Enabled_auto_position',
    comment:
      'Indicates whether GTIDs will be used to retrieve events from the master.',
    width: 1,
  })
  enabledAutoPosition: boolean;

  @Column('varchar', {
    primary: true,
    name: 'Channel_name',
    comment:
      'The channel on which the replica is connected to a source. Used in Multisource Replication',
    length: 64,
  })
  channelName: string;

  @Column('text', {
    name: 'Tls_version',
    nullable: true,
    comment: 'Tls version',
  })
  tlsVersion: string | null;

  @Column('text', {
    name: 'Public_key_path',
    nullable: true,
    comment: 'The file containing public key of master server.',
  })
  publicKeyPath: string | null;

  @Column('tinyint', {
    name: 'Get_public_key',
    comment: 'Preference to get public key from master.',
    width: 1,
  })
  getPublicKey: boolean;

  @Column('text', {
    name: 'Network_namespace',
    nullable: true,
    comment: 'Network namespace used for communication with the master server.',
  })
  networkNamespace: string | null;

  @Column('varchar', {
    name: 'Master_compression_algorithm',
    comment:
      'Compression algorithm supported for data transfer between source and replica.',
    length: 64,
  })
  masterCompressionAlgorithm: string;

  @Column('int', {
    name: 'Master_zstd_compression_level',
    comment: 'Compression level associated with zstd compression algorithm.',
    unsigned: true,
  })
  masterZstdCompressionLevel: number;

  @Column('text', {
    name: 'Tls_ciphersuites',
    nullable: true,
    comment:
      'Ciphersuites used for TLS 1.3 communication with the master server.',
  })
  tlsCiphersuites: string | null;

  @Column('tinyint', {
    name: 'Source_connection_auto_failover',
    comment: 'Indicates whether the channel connection failover is enabled.',
    width: 1,
    default: () => '\'0\'',
  })
  sourceConnectionAutoFailover: boolean;

  @Column('tinyint', {
    name: 'Gtid_only',
    comment:
      'Indicates if this channel only uses GTIDs and does not persist positions.',
    width: 1,
    default: () => '\'0\'',
  })
  gtidOnly: boolean;
}
