import { NextResponse } from 'next/server';
import { addInstallment, updateInstallment, deleteInstallment } from '@/lib/installments'; // Usa la lógica centralizada
import { getSheetsData } from '@/lib/googleSheets';

const INSTALLMENTS_TAB_ID = "1900302346"
export async function GET() {
  try {
    const rowInstallments = await getSheetsData(INSTALLMENTS_TAB_ID);
    const formattedInstallments = rowInstallments.map((installment: any) => ({
      date: installment["Mes"],
      installment: installment["Cuotas"],
      amount: parseFloat(installment["Monto"].replace(/\./g, '').replace(/,/g, '.')),
      dueDate: installment["Fecha Pago"],
      isPaid: installment["Fecha Pago"] ? true : false,
    }))
    
    return NextResponse.json(formattedInstallments)
  } catch (error) {
    console.error('Error fetching installments:', error);
    return NextResponse.json({ error: 'Failed to fetch installments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await addInstallment(body); // Agrega un nuevo gasto
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding installment:', error);
    return NextResponse.json({ error: 'Failed to add installment' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await updateInstallment(body.rowIndex, body.updatedInstallment); // Modifica el gasto
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating installment:', error);
    return NextResponse.json({ error: 'Failed to update installment' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    await deleteInstallment(body.rowIndex); // Elimina (marca como inactivo) el gasto
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting installment:', error);
    return NextResponse.json({ error: 'Failed to delete installment' }, { status: 500 });
  }
}
