import { NextResponse } from 'next/server';
import { addDailyWork, updateDailyWork, deleteDailyWork } from '@/lib/dailyWorks'; // Usa la lógica centralizada
import { getSheetsData } from '@/lib/googleSheets';

const DAILY_WORKS_TAB_ID = "202077207"
export async function GET() {
    try {
        const rowDailyWorks = await getSheetsData(DAILY_WORKS_TAB_ID);
        const formattedDailyWorks = rowDailyWorks.map((dailyWork: any) => ({
            day: dailyWork["Dia"],
            date: dailyWork["Fecha"],
            description: dailyWork["Descripcion"],
            isAdditional: dailyWork["Dia Adicional"] ? true : false,
            additionalDescription: dailyWork["Descripcion Adicional"],
            directedBy: dailyWork["Direccion"],
        }))

        return NextResponse.json(formattedDailyWorks)
    } catch (error) {
        console.error('Error fetching dailyWorks:', error);
        return NextResponse.json({ error: 'Failed to fetch dailyWorks' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        await addDailyWork(body);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error adding dailyWork:', error);
        return NextResponse.json({ error: 'Failed to add dailyWork' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        await updateDailyWork(body.rowIndex, body.updatedDailyWork);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating dailyWork:', error);
        return NextResponse.json({ error: 'Failed to update dailyWork' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        await deleteDailyWork(body.rowIndex);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting dailyWork:', error);
        return NextResponse.json({ error: 'Failed to delete dailyWork' }, { status: 500 });
    }
}
