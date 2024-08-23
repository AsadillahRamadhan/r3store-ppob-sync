import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

type ILogType = 'auto' | 'manual'
type ILogBound = 'inbound' | 'outbound'

export default class DatasourceLog extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id?: number | null

  @column()
  public ip?: string | null

  @column()
  public url: string

  @column()
  public request_method: string

  @column.dateTime({ autoCreate: true })
  public request_time: DateTime

  @column.dateTime()
  public finish_time: DateTime

  @column()
  public exec_time: number

  @column()
  public additional_headerparams: object

  @column()
  public additional_bodyparams: object

  @column()
  public additional_queryparams: object

  @column()
  public response_data: string

  @column()
  public log_type: ILogType

  @column()
  public log_bound: ILogBound

  @column()
  public request_status: string

  @column()
  public datasource: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
