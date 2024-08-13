export const productInputConfig = {
    pulsa: [
        {
            name: "phoneNumber",
            type: "text",
            inputmode: "numeric",
            length: 12,
            placeholder: "Masukkan Nomor HP"
        }
    ],
    finance: [
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
    ],
    dompetDigital: [
        {
            name: "phoneNumber",
            type: "text",
            inputMode: "numeric",
            length: 12,
            placeholder: "Masukkan Nomor HP"
        }
    ],
    tokenPln: [
        {
            name: "customerId",
            type: "text",
            inputmode: "numeric",
            length: 15,
            placeholder: "Masukkan Customer ID"
        }
    ]
}

export const categoryIdConfig = {
    pulsa: 4,
    tokenPln: 5,
    dompetDigital: 6,
    finance: 7
}