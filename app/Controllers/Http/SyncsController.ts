import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { inject } from "@adonisjs/core/build/standalone";
import SyncsService from "App/Services/SyncsService";
import axios from 'axios';

@inject()
export default class SyncsController {
    constructor(protected syncService: SyncsService){}

    async sync({request, response}: HttpContextContract){
        try {
            if(!await this.syncService.sync(request.param('data'))){
                return response.internalServerError({message: "Fetch failed!", success: false});
            }
            return response.ok({message: "Synchronized!", success: true});
        } catch (e){
            return response.internalServerError({message: e.message, success: false});
        }
    }

    async regex({request, response}){
        const res = await axios.get(`https://okeconnect.com/harga/json?id=905ccd028329b0a&produk=pulsa`);
        const data = await res.data;

        let str;
        const regex = /(T#\d+)\s+(R#R3S-\w+)\s+(.*)\s+([A-Za-z0-9]+\.\d+)\s+(.+?)\.\s+(Saldo\s[\d\.\s\-=\d]+)\s+@(\d{2}:\d{2})/;
        data.forEach(d => {
            str = `T#534212148 R#R3S-01J5QDTJHD1FVW1WJK6FQ1VSCV ${d.keterangan} ${d.kode}.085230301647  akan diproses. Saldo 147.651 - 2.945 = 144.706 @15:18`
            const match = str.match(regex);
            console.log(match);
        })
        return response.ok();
    }
}
