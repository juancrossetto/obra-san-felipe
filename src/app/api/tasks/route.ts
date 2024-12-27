import { NextResponse } from 'next/server';
import { addTask, updateTask, deleteTask } from '@/lib/tasks'; // Usa la lógica centralizada
import { getSheetsData } from '@/lib/googleSheets';

const TASKS_TAB_ID = "0"
export async function GET() {
  try {
    const rawTasks = await getSheetsData(TASKS_TAB_ID);
    const formattedTasks = rawTasks.map((task: any) => ({
      id: Number(task.rowNumber),
      name: task.Nombre,
      startDate: task["Fecha Inicio"],
      endDate: task["Fecha Fin"],
      status: task.Estado,
      progress: task.Progreso ? Math.round(parseFloat(task.Progreso.replace(',', '.'))) : 0
    }))
    return NextResponse.json(formattedTasks)
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await addTask(body); // Agrega un nuevo gasto
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding task:', error);
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await updateTask(body.rowIndex, body.updatedTask); // Modifica el gasto
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    await deleteTask(body.rowIndex); // Elimina (marca como inactivo) el gasto
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
