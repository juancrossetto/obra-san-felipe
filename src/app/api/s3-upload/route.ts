import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { addInstallment, updateInstallment, deleteInstallment } from '@/lib/installments'; // Usa la lógica centralizada
import { getSheetsData } from '@/lib/googleSheets';

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION || "",
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY || "",
    },
})
export async function GET(req: Request) {
    try {
        // const rowInstallments = await getSheetsData(INSTALLMENTS_TAB_ID);
        // const formattedInstallments = rowInstallments.map((installment: any) => ({
        //   date: installment["Mes"],
        //   installment: installment["Cuotas"],
        //   amount: parseFloat(installment["Monto"].replace(/\./g, '').replace(/,/g, '.')),
        //   dueDate: installment["Fecha Pago"],
        //   isPaid: installment["Fecha Pago"] ? true : false,
        // }))

        return NextResponse.json({ msg: "Hello API!" })
    } catch (error) {
        console.error('Error fetching installments:', error);
        return NextResponse.json({ error: 'Failed to fetch installments' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {

        return NextResponse.json({ msg: "Hello API!" })
    } catch (error) {
        return NextResponse.json({ error: 'Error uploading file' });
    }
}