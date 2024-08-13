import Database from "@ioc:Adonis/Lucid/Database";
import axios from "axios";
import { DateTime } from "luxon";
import { string } from '@ioc:Adonis/Core/Helpers'
import Product from "App/Models/Product";
import ProductItem from "App/Models/ProductItem";
import ProductInput from "App/Models/ProductInput";
import { productInputConfig } from "App/Statics/ProductInputConfig";

export default class SyncsRepositories {
    public async getData(param: string){
        const res = await axios.get(`https://okeconnect.com/harga/json?id=905ccd028329b0a&produk=${param}`);
        const data = res.data;
        return {
            success: res.status == 200 ? true : false,
            message: "Success API Call",
            status: res.status,
            data: data
        };
    }

    public async checkIfProductExists(produk: string){
        return Database.query().from('products').select('title').where('slug', string.toSlug(produk, {lower: true})).first();
    }

    public async storeProduct(data: any){
        let category_id = 4;
        if(data.kategori == 'TOKEN PLN'){
            category_id = 5;
        } else if(data.kategori == 'DOMPET DIGITAL'){
            category_id = 6;
        }
        return Database.insertQuery().table('products').insert({
            category_id: category_id,
            title: data.produk,
            slug: string.toSlug(data.produk, {lower: true}),
            desc: `${data.kategori} - ${data.produk}`,
            code: "PPOB",
            type: "ppob",
            is_active: 1,
            is_featured: 1,
            instruction_text: "ini adalah instruction",
            last_sync: `${DateTime.now()}`
        });
    }

    public async getProductItem(kode: string){
        return Database.query().from('product_items').select('name').whereJsonSuperset('provider', {raw: {kode: kode}}).first(); 
    }

    public async disableUnused(product_name: any[], now: DateTime){
        product_name.forEach(async (title: any) => {
            const product_id = await Product.query().select('id').where('title', title.produk).first();
            await ProductItem.query().select().where('product_id', `${product_id?.id}`).where('last_sync', '<', `${now}`).update({is_active: 0});
        });
    }

    public async createProductItem(data: any){
        const product_id = await Database.query().from('products').select('id').where('title', data.produk).first();
        return Database.insertQuery().table('product_items').insert({
            product_id: product_id.id,
            name: data.keterangan,
            provider: this.makeProvider(data),
            modal: data.harga,
            price: parseInt(data.harga) + 1000,
            is_discount: 0,
            is_fixed_discount: 0,
            discount_price: 0,
            bisnis_price: data.harga,
            enterprice_price: data.harga,
            is_active: parseInt(data.status),
            last_sync: `${DateTime.now()}`
        });
    }

    public async syncProductItem(data: any){
        return Database.query().from('product_items').whereJsonSuperset('provider', {raw: {kode: data.kode}}).update({
            name: data.keterangan,
            provider: this.makeProvider(data),
            modal: data.harga,
            price: parseInt(data.harga) + 1000,
            is_discount: 0,
            is_fixed_discount: 0,
            discount_price: 0,
            bisnis_price: data.harga,
            enterprice_price: data.harga,
            is_active: parseInt(data.status),
            last_sync: `${DateTime.now()}`
        })
    }

    public async createProductInput(kategori: string, produk: string){
        const data = productInputConfig[string.camelCase(kategori)];
        const product = await Product.findBy('title', produk);
        data.forEach(async (d: any) => {
            await ProductInput.create({
                productId: product?.id,
                tag: 'input',
                attrs: d
            });
        });
    }

    public async checkProductInput(produk: string){
        const product = await Product.findBy('title', produk);
        return await ProductInput.findBy('product_id', product?.id);
    }

    private makeProvider(data: any){
        const provider = {
            raw: data,
            product: {
                price: data.harga,
                isActive: data.status == 1 ? true : false,
                productCode: data.kode,
                productName: `${data.kategori}-${data.produk}`,
                productType: 'ppob',
                productItemCode: data.kode,
                productItemName: data.keterangan
            },
            vendorId: 5
        };

        return JSON.stringify(provider);
    }
    
}