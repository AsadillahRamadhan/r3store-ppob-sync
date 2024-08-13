import { inject } from "@adonisjs/core/build/standalone";
import SyncsRepositories from "App/Repositories/SyncsRepository";
import { DateTime } from "luxon";

@inject()
export default class SyncsService {
    constructor(protected syncRepository: SyncsRepositories){}
    public async sync(param: string){
        const now = DateTime.now();
        const data = await this.syncRepository.getData(param);
        if(!data.success){
            return false;
        }
        const unique = this.getUniqueBy(data.data);
        unique.forEach(async (u) => {
            if(!await this.syncRepository.checkIfProductExists(u.produk)){
                await this.syncRepository.storeProduct(u);
            }

            if(!await this.syncRepository.checkProductInput(u.produk)){
                await this.syncRepository.createProductInput(u.kategori, u.produk);
            }
        })
        data.data.forEach(async (d: any) => {
           if(!await this.syncRepository.getProductItem(d.kode)){
            await this.syncRepository.createProductItem(d);
           } else {
            await this.syncRepository.syncProductItem(d);
           }
        })

        await this.syncRepository.disableUnused(unique, now);
        
        return true;
    }

    private getUniqueBy(array: any[]) {
        const seen = new Set();
        return array.filter(item => {
            return seen.has(item.produk) ? false : seen.add(item.produk)
        });
    }
}