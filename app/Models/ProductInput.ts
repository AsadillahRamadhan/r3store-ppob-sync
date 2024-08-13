import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'

export default class ProductInput extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null})
  public productId: number

  @column()
  public tag: string

  @column()
  public attrs: object | string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime
}