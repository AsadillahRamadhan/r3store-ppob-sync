import Database from "@ioc:Adonis/Lucid/Database"
import DatasourceLog from "App/Models/DatasourceLog"
import axios from "axios"
import { DateTime } from "luxon"

export default class BankChecker {

    public baseUrl: string = 'https://api.riwayat.or.id'
    
    private userCredential: any

    private listBank: any = {
        mandiri: '008',
        bca: '014',
        bri: '002',
        permata: '013',
        bsi: '451',
        bni: '009'
    }

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
        // const memberId = config.find(one => one.key == 'memberId')
        // const pin = config.find(one => one.key == 'pin')
        // const password = config.find(one => one.key == 'password')

        this.baseUrl = url?.value
    }

    /**
     * * Check Bank by Account Number
     */
    public async checkBankByAccountNumber(bankChannel: string, accountNumber: string) {

        await this.initConfig()

        const bankCode = this.listBank[bankChannel]

        let instance = axios.create({
            baseURL: `${this.baseUrl}`,
            params: {
                bankCode: bankCode,
                accountNumber: accountNumber
            }
        })

        const reqStart = Date.now()

        // * Create datasource log
        const log = await DatasourceLog.create({
            user_id: this.userCredential?.id ?? null,
            ip: '172.67.188.144',
            url: `${this.baseUrl}/rekApi.php`,
            request_method: 'GET',
            request_time: DateTime.now(),
            additional_headerparams: instance?.defaults?.headers,
            additional_bodyparams: instance?.defaults?.data,
            additional_queryparams: instance?.defaults?.params,
            log_type: 'manual',
            log_bound: 'outbound',
            datasource: 'BANK_CHECKER'
        })

        try {
            const res = await instance.get(`/rekApi.php`)

            // * Update datasource log
            log.finish_time = DateTime.now()
            log.exec_time = Date.now() - reqStart
            log.response_data = (typeof res?.data == 'object') ? JSON.stringify(res.data) : res.data
            log.request_status = `${res?.status}`
            await log.save()

            console.log('result', res.data)

            return {
                success: true,
                status: res.status,
                data: JSON.parse(res.data),
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
}