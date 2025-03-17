import { sheets, SPREADSHEET_ID } from '@/lib/googleSheets';
import { DailyWork } from '@/types';
// import { capitalizeText } from './utils';

const DAILY_WORKS_TAB_ID = "202077207"

export const addDailyWork = async (dailyWork: DailyWork) => {

    const values = [
        [
            dailyWork.day,
            dailyWork.date,
            dailyWork.description,
            dailyWork.isAdditional,
            dailyWork.additionalDescription,
            dailyWork.directedBy,
        ],
    ];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Trabajos!A:Z',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });
        console.log('DailyWork added successfully');
    } catch (error) {
        console.error('Error adding dailyWork:', error);
    }
};

export const updateDailyWork = async (rowIndex: number, updatedDailyWork: DailyWork) => {
    const range = `Trabajos!A${rowIndex}:G${rowIndex}`;
    const values = [
        [
            updatedDailyWork.day,
            updatedDailyWork.date,
            updatedDailyWork.description,
            updatedDailyWork.isAdditional,
            updatedDailyWork.additionalDescription,
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
        console.log('DailyWork updated successfully');
    } catch (error) {
        console.error('Error updating dailyWork:', error);
    }
};

export const deleteDailyWork = async (rowIndex: number) => {
    try {
        // Configuración para eliminar la fila
        const request = {
            spreadsheetId: SPREADSHEET_ID,
            resource: {
                requests: [
                    {
                        deleteDimension: {
                            range: {
                                sheetId: DAILY_WORKS_TAB_ID, // Cambia esto al `sheetId` correcto si no es la primera hoja
                                dimension: 'ROWS',
                                startIndex: rowIndex - 1, // La API usa índices basados en 0
                                endIndex: rowIndex, // Elimina una sola fila
                            },
                        },
                    },
                ],
            },
        };

        // Llama a la API para eliminar la fila
        await sheets.spreadsheets.batchUpdate(request);

        console.log(`DailyWork at row ${rowIndex} deleted successfully`);
    } catch (error) {
        console.error('Error deleting dailyWork:', error);
    }
};
