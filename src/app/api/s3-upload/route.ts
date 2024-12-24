import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { addInstallment, updateInstallment, deleteInstallment } from '@/lib/installments'; // Usa la lógica centralizada
// import { getSheetsData } from '@/lib/googleSheets';

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION || "eu-west-2",
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY || "",
    },
})

async function uploadFileToS3(file: any, fileName: string) {

	const fileBuffer = file;
	console.log(fileName);

	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: `${fileName}`,
		Body: fileBuffer,
		ContentType: "image/jpg"
	}

	const command = new PutObjectCommand(params);
	await s3Client.send(command);
	return fileName;
}
export async function GET(req: Request) {
    try {
        return NextResponse.json({ msg: "Hello API!" })
    } catch (error) {
        console.error('Error fetching installments:', error);
        return NextResponse.json({ error: 'Failed to fetch installments' }, { status: 500 });
    }
}

export async function POST(request: Request) {
	try {

		const formData = await request.formData();
		const file: any = formData.get("file");

		if(!file) {
			return NextResponse.json( { error: "File is required."}, { status: 400 } );
		} 

		const buffer = Buffer.from(await file.arrayBuffer());
		const fileName = await uploadFileToS3(buffer, file.name);

		return NextResponse.json({ success: true, fileName});
	} catch (error) {
		return NextResponse.json({ error });
	}
}