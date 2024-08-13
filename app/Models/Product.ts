import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed, hasMany, HasMany, scope } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import CategoryProduct from 'App/Models/CategoryProduct'
import ProductInput from 'App/Models/ProductInput'
// import ProductFaq from 'App/Models/ProductFaq'
import ProductItem from 'App/Models/ProductItem'
import Env from '@ioc:Adonis/Core/Env'

export default class Product extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public categoryId: number

  @column()
  public title: string

  @column()
  public slug: string

  @column()
  public subTitle?: string | null

  @column()
  public desc?: string | null

  @column()
  public code?: string | null

  @column()
  public type?: string | null

  @column()
  public logo?: string | null

  @column()
  public banner?: string | null

  @column()
  public helper?: string | null

  @column()
  public isActive: boolean

  @column()
  public isFeatured: boolean

  @column()
  public instructionText?: string | null

  @column()
  public buySectionTitle?: string | null

  @column()
  public fieldSectionTitle?: string | null

  @column()
  public itemSectionTitle?: string | null

  @column()
  public paymentSectionTitle?: string | null

  @column()
  public voucherSectionTitle?: string | null

  @column.dateTime()
  public lastSync: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @computed()
  public get logo_url() {
    return Env.get('APP_URL') + '/' + this.logo
  }

  @computed()
  public get banner_url() {
    return Env.get('APP_URL') + '/' + this.banner
  }

  @computed()
  public get helper_url() {
    return Env.get('APP_URL') + '/' + this.helper
  }

  @belongsTo(() => CategoryProduct, {
    foreignKey: "categoryId"
  })
  public category: BelongsTo<typeof CategoryProduct>

  @hasMany(() => ProductInput)
  public productInput: HasMany<typeof ProductInput>

//   @hasMany(() => ProductFaq)
//   public faqs: HasMany<typeof ProductFaq>

  @hasMany(() => ProductItem)
  public items: HasMany<typeof ProductItem>

  public static filtered = scope((query, filter) => {
    if (filter == null || filter == '' || !filter) {
      return
    }

    // query.where('products.title', 'like', `%${filter}`).orWhere('products.sub_title', 'like', `%${filter}%`).orWhere('products.desc', 'like', `%${filter}%`).orWhere('products.code', 'like', `%${filter}%`)
    query.where('products.title', 'like', `%${filter}%`).orWhere('products.code', 'like', `%${filter}%`)
  })

  public static searchFilter = scope((query, searchKey) => {

    if (searchKey && searchKey != '') {
      query.where('products.title', 'LIKE', `%${searchKey}%`)
    }

    return
  })
}
