import { sheets, SPREADSHEET_ID } from '@/lib/googleSheets';
import { Payment } from '@/types';

const PAYMENTS_TAB_ID = "1899500439"

// Agregar un gasto
export const addPayment = async (payment: Payment) => {
    const values = [
        [
            payment.description,
            payment.paymentMethod,
            payment.date,
            payment.amount,
        ],
    ];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Pagos!A:Z',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });
        console.log('Payment added successfully');
    } catch (error) {
        console.error('Error adding payment:', error);
    }
};

// Modificar un gasto
export const updatePayment = async (rowIndex: number, updatedPayment: Payment) => {
    const range = `Pagos!A${rowIndex}:D${rowIndex}`;
    const values = [
        [
            updatedPayment.description,
            updatedPayment.paymentMethod,
            updatedPayment.date,
            updatedPayment.amount,
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
        console.log('Payment updated successfully');
    } catch (error) {
        console.error('Error updating payment:', error);
    }
};

// Eliminar un gasto (marcarlo como inactivo)
export const deletePayment = async (rowIndex: number) => {
    try {
        // Configuración para eliminar la fila
        const request = {
          spreadsheetId: SPREADSHEET_ID,
          resource: {
            requests: [
              {
                deleteDimension: {
                  range: {
                    sheetId: PAYMENTS_TAB_ID,
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
    
        console.log(`Payment at row ${rowIndex} deleted successfully`);
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
};
