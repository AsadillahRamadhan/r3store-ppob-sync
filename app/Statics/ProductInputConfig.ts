export default class ProductInputConfig {
    static pulsa(){
        const data = {
            name: "phoneNumber",
            type: "text",
            inputmode: "numeric",
            length: 12,
            placeholder: "Masukkan Nomor HP"
        };

        return JSON.stringify(data);
    }

    static dompetDigital(){
        const data = {
            name: "phoneNumber",
            type: "text",
            inputMode: "numeric",
            length: 12,
            placeholder: "Masukkan Nomor HP"
        };

        return JSON.stringify(data);
    }

    static finance(){
        const data = [
           {
                name: "accountNumber",
                type: "text",
                inputmode: "numeric",
                length: "12",
                placeholder: "Masukkan Nomor Rekening"
            },
            {
                name: "accountHolderName",
                type: "text",
                inputmode: "numeric",
                length: "128",
                placeholder: "Masukkan Nama"
            }   
        ];

        return JSON.stringify(data);
    }

    static tokenPln(){
        const data = {
            name: "customerId",
            type: "text",
            inputmode: "numeric",
            length: 15,
            placeholder: "Masukkan Customer ID"
        }

        return JSON.stringify(data);
    }
}