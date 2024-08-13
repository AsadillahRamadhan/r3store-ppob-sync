import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import Env from '@ioc:Adonis/Core/Env'
import Product from './Product'

export default class ProductItem extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public productId: number

  @column()
  public name: string

  @column()
  public icon?: string | null

  @column()
  public providerId?: number | null

  // @column()
  // public provider?: object | null

  @column()
  public provider?: string

  @column()
  public modal?: number | 0

  @column()
  public price?: number | 0

  @column()
  public isDiscount: boolean

  @column()
  public isFixedDiscount: boolean

  @column()
  public discountPrice?: number | 0

  @column()
  public discountPercent?: string | null

  @column()
  public bisnisPrice?: number | 0

  @column()
  public enterpricePrice?: number | 0

  @column()
  public isActive: boolean

  @column.dateTime()
  public lastSync: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @computed()
  public get icon_url() {
    return this.icon ? Env.get('APP_URL') + '/' + this.icon : null
  }

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>
}
