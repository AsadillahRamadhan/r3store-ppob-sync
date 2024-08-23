import Database from "@ioc:Adonis/Lucid/Database"
import DatasourceLog from "App/Models/DatasourceLog"
import axios from "axios"
import * as crypto from 'crypto'
import { DateTime } from "luxon"

type ICreateTransaction = {
    destination: string,
    refId: string
}

type IParsingType = 'sukses' | 'gagal' | 'createTransaction'

export default class OkeConnect {

    public baseUrl: string = ''
    private memberId: string = ''
    private pin: string = ''
    private password: string = ''

    private userCredential: any

    constructor(user?: any) {

        this.userCredential = user
    }

    /**
     * * Init Config
     */
    private async initConfig() {

        const config = await Database.from('vendors')
            .select([
                'vendors.name as vendor_name', 'vendors.type as vendor_type', 'vendors.domain as vendor_domain',
                'vendor_settings.keyword as key', 'vendor_settings.nilai as value'
            ])
            .join('vendor_settings', 'vendor_settings.vendor_id', 'vendors.id')
            .where('vendors.slug', 'okeconnect-api')

        const url = config.find(one => one.key == 'url')
        const memberId = config.find(one => one.key == 'memberId')
        const pin = config.find(one => one.key == 'pin')
        const password = config.find(one => one.key == 'password')

        this.baseUrl = url?.value
        this.memberId = memberId?.value
        this.pin = pin?.value
        this.password = password?.value
    }

    /**
     * * Get Product List
     */
    public async getProductList(param: string) {

        await this.initConfig()

        let instance = axios.create({
            baseURL: `https://okeconnect.com`,
            params: {
                id: '905ccd028329b0a',
                produk: param
            }
        })

        const reqStart = Date.now()

        // * Create datasource log
        const log = await DatasourceLog.create({
            user_id: this.userCredential?.id ?? null,
            ip: '103.139.245.108',
            url: `https://okeconnect.com/harga/json`,
            request_method: 'GET',
            request_time: DateTime.now(),
            additional_headerparams: instance?.defaults?.headers,
            additional_bodyparams: instance?.defaults?.data,
            additional_queryparams: instance?.defaults?.params,
            log_type: 'manual',
            log_bound: 'outbound',
            datasource: 'OKECONNECT'
        })

        try {
            const res = await instance.get(`/harga/json`)

            // * Update datasource log
            log.finish_time = DateTime.now()
            log.exec_time = Date.now() - reqStart
            log.response_data = (typeof res?.data == 'object') ? JSON.stringify(res.data) : res.data
            log.request_status = `${res?.status}`
            await log.save()

            return {
                success: true,
                status: res.status,
                data: res.data,
                // raw: res
            }
        } catch (err: any) {

            // * Update datasource log error
            log.finish_time = DateTime.now()
            log.exec_time = Date.now() - reqStart
            log.response_data = (typeof err?.response?.data == 'object') ? JSON.stringify(err?.response.data) : err?.response.data
            log.request_status = `${err?.response?.status}`
            await log.save()

            return {
                success: false,
                message: err.response.statusText,
                status: err.response.status,
                data: err.response.data,
                raw: err
            }
        }
    }

    /**
     * * Check Balance
     */
    public async checkBalance() {

        await this.initConfig()

        let instance = axios.create({
            baseURL: `${this.baseUrl}`,
            params: {
                memberID: this.memberId,
                pin: this.pin,
                password: this.password
            }
        })

        const reqStart = Date.now()

        // * Create datasource log
        const log = await DatasourceLog.create({
            user_id: this.userCredential?.id ?? null,
            ip: '103.139.245.108',
            url: `${this.baseUrl}/trx/balance`,
            request_method: 'GET',
            request_time: DateTime.now(),
            additional_headerparams: instance?.defaults?.headers,
            additional_bodyparams: instance?.defaults?.data,
            additional_queryparams: instance?.defaults?.params,
            log_type: 'manual',
            log_bound: 'outbound',
            datasource: 'OKECONNECT'
        })

        try {
            const res = await instance.get(`/trx/balance`)

            // * Update datasource log
            log.finish_time = DateTime.now()
            log.exec_time = Date.now() - reqStart
            log.response_data = (typeof res?.data == 'object') ? JSON.stringify(res.data) : res.data
            log.request_status = `${res?.status}`
            await log.save()

            return {
                success: true,
                status: res.status,
                data: res.data,
                // raw: res
            }
        } catch (err: any) {

            // * Update datasource log error
            log.finish_time = DateTime.now()
            log.exec_time = Date.now() - reqStart
            log.response_data = (typeof err?.response?.data == 'object') ? JSON.stringify(err?.response.data) : err?.response.data
            log.request_status = `${err?.response?.status}`
            await log.save()

            return {
                success: false,
                message: err.response.statusText,
                status: err.response.status,
                data: err.response.data,
                raw: err
            }
        }
    }

    /**
     * * Create Transaction
     */
    public async createTransaction(productCode: string, optionData: ICreateTransaction) {

        await this.initConfig()

        let instance = axios.create({
            baseURL: `${this.baseUrl}`,
            params: {
                memberID: this.memberId,
                pin: this.pin,
                password: this.password,
                product: productCode,
                dest: optionData.destination,
                refID: optionData.refId
            }
        })

        const reqStart = Date.now()

        // * Create datasource log
        const log = await DatasourceLog.create({
            user_id: this.userCredential?.id ?? null,
            ip: '103.139.245.108',
            url: `${this.baseUrl}/trx`,
            request_method: 'GET',
            request_time: DateTime.now(),
            additional_headerparams: instance?.defaults?.headers,
            additional_bodyparams: instance?.defaults?.data,
            additional_queryparams: instance?.defaults?.params,
            log_type: 'manual',
            log_bound: 'outbound',
            datasource: 'OKECONNECT'
        })

        try {

            const res = await instance.get(`/trx`)

            // * Update datasource log
            log.finish_time = DateTime.now()
            log.exec_time = Date.now() - reqStart
            log.response_data = (typeof res?.data == 'object') ? JSON.stringify(res.data) : res.data
            log.request_status = `${res?.status}`
            await log.save()

            return {
                success: true,
                status: res.status,
                data: res.data,
                // raw: res
            }
        } catch (err: any) {

            // * Update datasource log error
            log.finish_time = DateTime.now()
            log.exec_time = Date.now() - reqStart
            log.response_data = (typeof err?.response?.data == 'object') ? JSON.stringify(err?.response.data) : err?.response.data
            log.request_status = `${err?.response?.status}`
            await log.save()

            return {
                success: false,
                message: err.response.statusText,
                status: err.response.status,
                data: err.response.data,
                raw: err
            }
        }
    }

    /**
     * * Check Transaction Status
     */
    public async checkTransactionStatus(productCode: string, optionData: ICreateTransaction) {

        const sign = this.generateSign('OtomaX', this.memberId, productCode, optionData.destination, optionData.refId, this.pin, this.password)

        let instance = axios.create({
            baseURL: `${this.baseUrl}`,
            params: {
                memberID: this.memberId,
                pin: this.pin,
                password: this.password,
                product: productCode,
                dest: optionData.destination,
                refID: optionData.refId,
                sign: sign
            }
        })

        try {

            const res = await instance.get(`/trx`)

            return {
                success: true,
                status: res.status,
                data: res.data,
                // raw: res
            }
        } catch (err: any) {

            return {
                success: false,
                message: err.response.statusText,
                status: err.response.status,
                data: err.response.data,
                raw: err
            }
        }
    }

    public parseStringResponseToJson(type: IParsingType = 'sukses', str: string) {

        let result: any

        if (type == 'sukses') {

            const regex = /(T#\d+)\s+(R3S#\d+)\s+([A-Za-z]+)\s([\d.,]+)\s+([A-Z]\d+\.\d+)\s+(\w+)\.\s+SN\/Ref:\s+([\w.]+)\.\s+Saldo\s+([\d.,]+)\s+-\s+([\d.,]+)\s+=\s+([\d.,]+)\s+@(\d{2}\/\d{2})\s+(\d{2}:\d{2})/

            const match = str.match(regex)

            if (match) {
                result = {
                    transactionNumber: match[1],
                    transactionCode: match[2],
                    productName: `${match[3]} ${match[4]}`,
                    productCodeWithDestination: match[5],
                    status: match[6],
                    snRef: match[7],
                    balance: `Saldo ${match[8]} - ${match[9]} = ${match[10]}`,
                    time: match[12]
                }
            } else {
                result = null
            }
        } else if (type == 'gagal') {

            const regex = /(T#\d+)\s+(R#\d+)\s+([^\s]+(?:\s+[^\s]+)*)\s+(\S+)\s+(\w+)\.\s*([^\.]+?)\.\s*Saldo\s*([\d\.,]+)\s*@(\d{2}:\d{2})/;

            const match = str.match(regex)

            if (match) {
                result = {
                    transactionNumber: match[1],
                    transactionCode: match[2],
                    productName: match[3],
                    productCodeWithDestination: match[4],
                    status: match[5],
                    errorMessage: match[6].trim(),
                    balance: `Saldo ${match[7]}`,
                    time: match[8]
                }
            } else {
                result = null
            }
        } else if (type == 'createTransaction') {

            const regex = /(T#\d+)\s+(R3S#\d+)\s+([A-Za-z0-9]+\.\d+)\s+(.+?)\.\s+(Saldo\s[\d\.\s\-=\d]+)\s+@(\d{2}:\d{2})/;
    
            const match = str.match(regex);
    
            if (match) {
                result = {
                    transactionNumber: match[1],
                    transactionCode: match[2],
                    productCodeWithDestination: match[3],
                    status: match[4],
                    balance: match[5],
                    time: match[6]
                };
            } else {
                result = null;
            }
        }

        return result
    }
    

    private encodeBase64(value: string) {
        return Buffer.from(value).toString('base64')
    }

    private generateSign(otomaX: string, memberId: string, productCode: string, destination: string, refId: string, pin: string, password: string) {
        
        const data = `${otomaX}${memberId}${productCode}${destination}${refId}${pin}${password}`
        const sha1Hash = crypto.createHash('sha1').update(data).digest('hex')
        return this.encodeBase64(sha1Hash)
    }
}