import { NextResponse } from 'next/server';
import { addExpense, updateExpense, deleteExpense } from '@/lib/expenses'; // Usa la lógica centralizada
import { getSheetsData } from '@/lib/googleSheets';

const EXPENSES_TAB_ID = "1103610429"
export async function GET() {
  try {
    const rawExpenses = await getSheetsData(EXPENSES_TAB_ID); // Trae los datos desde la hoja
    const formattedExpenses = rawExpenses.map((expense: any) => ({
      id: Number(expense.rowNumber),
      date: expense.Fecha, // Suponiendo que la fecha ya tiene el formato correcto
      category: expense.Categoria,
      description: expense.Descripcion,
      // amount: parseFloat(expense.amount), // Convertir a número
      amount: parseFloat(expense.Monto.replace(/\./g, '').replace(/,/g, '.')),
      supplier: expense.Proveedor,
      paid: expense.Pagado === 'SI', // Convertir "SI" o "NO" a booleano,
      images: expense.Imagenes ? expense.Imagenes.split(",").map((url: string) => url.trim()) : [],
    }))
    return NextResponse.json(formattedExpenses)
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await addExpense(body); // Agrega un nuevo gasto
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json({ error: 'Failed to add expense' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await updateExpense(body.rowIndex, body.updatedExpense); // Modifica el gasto
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    console.log("body:", body)
    await deleteExpense(body.rowIndex); // Elimina (marca como inactivo) el gasto
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
