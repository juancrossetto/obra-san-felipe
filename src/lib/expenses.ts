import { sheets, SPREADSHEET_ID } from '@/lib/googleSheets';
import { Expense } from '@/types';
import { capitalizeText } from './utils';

const EXPENSES_TAB_ID = "1103610429"
// Agregar un gasto
export const addExpense = async (expense: Expense) => {

  const images = Array.isArray(expense.images)
    ? expense.images.join(", ")
    : "";
  const values = [
    [
      expense.date,
      expense.amount,
      expense.description,
      capitalizeText(expense.category),
      capitalizeText(expense.supplier),
      expense.paid ? 'SI' : 'NO',
      images
    ],
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Gastos!A:Z',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
    console.log('Expense added successfully');
  } catch (error) {
    console.error('Error adding expense:', error);
  }
};

// Modificar un gasto
export const updateExpense = async (rowIndex: number, updatedExpense: Expense) => {
  const images = Array.isArray(updatedExpense.images)
    ? updatedExpense.images.join(", ") // Convertir a cadena
    : "";

  const range = `Gastos!A${rowIndex}:G${rowIndex}`;
  const values = [
    [
      updatedExpense.date || 0,
      updatedExpense.amount,
      updatedExpense.description,
      capitalizeText(updatedExpense.category),
      capitalizeText(updatedExpense.supplier),
      updatedExpense.paid ? 'SI' : 'NO',
      images
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
    console.log('Expense updated successfully');
  } catch (error) {
    console.error('Error updating expense:', error);
  }
};

export const deleteExpense = async (rowIndex: number) => {
  try {
    // Configuración para eliminar la fila
    const request = {
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: EXPENSES_TAB_ID, // Cambia esto al `sheetId` correcto si no es la primera hoja
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

    console.log(`Expense at row ${rowIndex} deleted successfully`);
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
};
