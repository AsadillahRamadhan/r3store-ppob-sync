import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import Product from './Product'

export default class CategoryProduct extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public slug: string

  @column()
  public type: string

  @column()
  public image?: string | null

  @column()
  public desc?: string | null

  @column()
  public urut?: number | null

  @column()
  public isActive?: boolean | false

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime | null

  /**
   * * Relation to `Product` model
   */
  @hasMany(() => Product, {
    foreignKey: 'categoryId',
    localKey: 'id'
  })
  public products: HasMany<typeof Product>
}
