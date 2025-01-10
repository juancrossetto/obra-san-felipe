import { NextResponse } from 'next/server';
import { addPayment, updatePayment, deletePayment } from '@/lib/payments'; // Usa la lógica centralizada
import { getSheetsData } from '@/lib/googleSheets';

const PAYMENTS_TAB_ID = "1899500439"
export async function GET() {
  try {
    const rowPayments = await getSheetsData(PAYMENTS_TAB_ID);
    const formattedPayments = rowPayments.map((payment: any) => ({
      id: Number(payment.rowNumber),
      description: payment["Descripcion Pago"],
      paymentMethod: payment["Forma Pago"],
      paidTo: payment["Pagado a"],
      date: payment["Fecha"],
      amount: parseFloat(payment["Monto"].replace(/\./g, '').replace(/,/g, '.')),
    }))
    
    return NextResponse.json(formattedPayments)
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await addPayment(body); // Agrega un nuevo gasto
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding payment:', error);
    return NextResponse.json({ error: 'Failed to add payment' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await updatePayment(body.rowIndex, body.updatedPayment); // Modifica el gasto
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    await deletePayment(body.rowIndex); // Elimina (marca como inactivo) el gasto
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 });
  }
}
