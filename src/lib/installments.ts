import { sheets, SPREADSHEET_ID } from '@/lib/googleSheets';
import { Installment } from '@/types';

// Agregar un gasto
export const addInstallment = async (installment: Installment) => {
    const values = [
        [
            installment.date,
            installment.installment,
            installment.amount,
            installment.isPaid,
        ],
    ];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Cuotas!A:Z',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });
        console.log('Installment added successfully');
    } catch (error) {
        console.error('Error adding installment:', error);
    }
};

// Modificar un gasto
export const updateInstallment = async (rowIndex: number, updatedInstallment: Installment) => {
    const range = `Cuotas!A${rowIndex}:F${rowIndex}`;
    const values = [
        [
            updatedInstallment.date,
            updatedInstallment.installment,
            updatedInstallment.amount,
            updatedInstallment.isPaid,
        ],
    ];

    try {
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });
        console.log('Installment updated successfully');
    } catch (error) {
        console.error('Error updating installment:', error);
    }
};

// Eliminar un gasto (marcarlo como inactivo)
export const deleteInstallment = async (rowIndex: number) => {
    const range = `Cuotas!G${rowIndex}`;
    const values = [['0']]; // Estado inactivo

    try {
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range,
            valueInputOption: 'RAW',
            requestBody: {
                values,
            },
        });
        console.log('Installment deleted (marked as inactive) successfully');
    } catch (error) {
        console.error('Error deleting installment:', error);
    }
};
