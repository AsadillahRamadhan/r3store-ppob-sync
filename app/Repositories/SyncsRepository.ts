import Database from "@ioc:Adonis/Lucid/Database";
import axios from "axios";
import slugify from "slugify";

export default class SyncsRepositories {
    public async getData(param: string){
        return axios.get(`https://okeconnect.com/harga/json?id=905ccd028329b0a&produk=${param}`);
    }

    public async checkIfProductExists(produk: string){
        return await Database.query().from('products').select('title').where('slug', slugify(produk, {lower: true})).first();
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
            slug: slugify(data.produk, {lower: true}),
            desc: "deskripsi",
            code: "PPOB",
            type: "topup",
            is_active: 1,
            is_featured: 1,
            instruction_text: "ini adalah instruction",
            last_sync: this.getDate(Date.now())
        });
    }

    public async getProductItem(name: string){
        return Database.query().from('product_items').select('name').where('name', name).first();
    }

    public async createProductItem(data: any){
        const product_id = await Database.query().from('products').select('id').where('title', data.produk).first();
        return Database.insertQuery().table('product_items').insert({
            product_id: product_id.id,
            name: data.keterangan,
            provider: data,
            modal: data.harga,
            price: data.harga,
            is_discount: 0,
            is_fixed_discount: 0,
            discount_price: 0,
            bisnis_price: data.harga,
            enterprice_price: data.harga,
            is_active: parseInt(data.status),
            last_sync: this.getDate(Date.now())
        });
    }

    public async syncProductItem(data: any){
        return Database.query().from('product_items').where('name', data.keterangan).update({
            name: data.keterangan,
            provider: JSON.stringify(data),
            modal: data.harga,
            price: data.harga,
            is_discount: 0,
            is_fixed_discount: 0,
            discount_price: 0,
            bisnis_price: data.harga,
            enterprice_price: data.harga,
            is_active: parseInt(data.status),
            last_sync: this.getDate(Date.now())
        })
    }

    private getDate(date: number){
        const now = new Date(date);

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    
}