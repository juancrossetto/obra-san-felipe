import { sheets, SPREADSHEET_ID } from '@/lib/googleSheets';
import { Task } from '@/types';

// Agregar un gasto
export const addTask = async (task: Task) => {
  const values = [
    [
      task.id,
      task.name,
      task.startDate,
      task.endDate,
      task.status,
    ],
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Tasks!A:Z',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
    console.log('Task added successfully');
  } catch (error) {
    console.error('Error adding task:', error);
  }
};

// Modificar un gasto
export const updateTask = async (rowIndex: number, updatedTask: Task) => {
  const range = `Tasks!A${rowIndex}:F${rowIndex}`;
  const values = [
    [
      updatedTask.id,
      updatedTask.name,
      updatedTask.startDate,
      updatedTask.endDate,
      updatedTask.status,
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
    console.log('Task updated successfully');
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

// Eliminar un gasto (marcarlo como inactivo)
export const deleteTask = async (rowIndex: number) => {
  const range = `Tasks!G${rowIndex}`;
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
    console.log('Task deleted (marked as inactive) successfully');
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};
