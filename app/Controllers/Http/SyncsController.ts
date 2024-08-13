import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { inject } from "@adonisjs/core/build/standalone";
import SyncsService from "App/Services/SyncsService";

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
}
