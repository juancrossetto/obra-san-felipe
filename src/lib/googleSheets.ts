import { google } from 'googleapis'

const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
export const sheets = google.sheets({ version: 'v4', auth });

export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;

export const getSheetTitleById = async (sheets: any, spreadsheetId: string, sheetId: string) => {
    try {
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId,
            fields: "sheets(properties(sheetId,title))",
        });

        const sheet = spreadsheet.data.sheets?.find((s: any) => s.properties?.sheetId?.toString() === sheetId);

        return sheet ? sheet.properties.title : undefined;
    } catch (error) {
        console.error("Error fetching sheet title by ID", error);
        return undefined;
    }
};

export const getSheetsData = async (sheetId?: string) => {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    let range = "Tareas!A:Z"
    const sheetTitle = await getSheetTitleById(sheets, process.env.GOOGLE_SHEETS_ID as string, sheetId || "0");
    if (sheetTitle) {
        range = `${sheetTitle}!A:Z`;
    }
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEETS_ID,
            range,
        })
        const rows = response.data.values;
        if (rows?.length) {
          const headers = rows.shift()?.map((header: string) => header.trim());
    
          const data = rows.map((row, index) => {
            const obj: Record<string, any> = { rowNumber: index + 2 };
            headers?.forEach((header: string, index: number) => {
              if (header !== "") {
                obj[header] = row[index];
              }
            });
            return obj;
          });
    
          return data;
        } else {
          console.log("No data found.");
          return [];
        }
    } catch (error) {
        console.error("Error fetching sheets data", error)
        return []
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // Datos mockeados
// let mockExpenses = [
//     { id: 1, date: '2023-06-01', category: 'Materiales', description: 'Cemento', amount: 5000, supplier: 'Corralón A', paid: true },
//     { id: 2, date: '2023-06-02', category: 'Mano de Obra', description: 'Albañil', amount: 10000, supplier: 'Juan Pérez', paid: false },
//     { id: 3, date: '2023-06-03', category: 'Herramientas', description: 'Alquiler andamios', amount: 2000, supplier: 'Alquileres XYZ', paid: true },
//   ]
  
//   export async function fetchExpenses() {
//     return mockExpenses.filter(expense => expense.id !== 0)
//   }
  
//   export async function addExpense(expense: any) {
//     const newExpense = {
//       id: Date.now(),
//       date: expense.date,
//       category: expense.category,
//       description: expense.description,
//       amount: expense.amount,
//       supplier: expense.supplier,
//       paid: expense.paid,
//     }
//     mockExpenses.push(newExpense)
//   }
  
//   export async function deleteExpense(id: number) {
//     mockExpenses = mockExpenses.map(expense => 
//       expense.id === id ? { ...expense, id: 0 } : expense
//     )
//   }
  
//   export async function editExpense(id: number, updatedExpense: any) {
//     mockExpenses = mockExpenses.map(expense => 
//       expense.id === id ? { ...expense, ...updatedExpense } : expense
//     )
//   }
  
//   export async function fetchSupplierDebts() {
//     const debts = mockExpenses
//       .filter(expense => !expense.paid && expense.id !== 0)
//       .reduce((acc: any, expense) => {
//         if (!acc[expense.supplier]) {
//           acc[expense.supplier] = 0
//         }
//         acc[expense.supplier] += expense.amount
//         return acc
//       }, {})
  
//     return Object.entries(debts).map(([supplier, amount]) => ({
//       supplier,
//       amount: amount as number,
//     }))
//   }
  
//   export async function fetchTasks() {
//     return [
//       { id: 1, name: 'Cimientos', startDate: new Date('2023-06-01'), endDate: new Date('2023-06-15'), status: 'Completado' },
//       { id: 2, name: 'Levantamiento de muros', startDate: new Date('2023-06-16'), endDate: new Date('2023-07-15'), status: 'En Proceso' },
//       { id: 3, name: 'Instalación eléctrica', startDate: new Date('2023-07-16'), endDate: new Date('2023-07-31'), status: 'Pendiente' },
//       { id: 4, name: 'Plomería', startDate: new Date('2023-08-01'), endDate: new Date('2023-08-15'), status: 'Pendiente' },
//       { id: 5, name: 'Acabados', startDate: new Date('2023-08-16'), endDate: new Date('2023-09-15'), status: 'Pendiente' },
//     ]
//   }
  

// import { google } from 'googleapis'

// const auth = new google.auth.GoogleAuth({
//   keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// })

// const sheets = google.sheets({ version: 'v4', auth })

// const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID

// export async function fetchExpenses() {
//   const response = await sheets.spreadsheets.values.get({
//     spreadsheetId: SPREADSHEET_ID,
//     range: 'Expenses!A2:G',
//   })

//   const rows = response.data.values

//   if (!rows || rows.length === 0) {
//     return []
//   }

//   return rows.map((row: any) => ({
//     id: parseInt(row[0]),
//     date: row[1],
//     category: row[2],
//     description: row[3],
//     amount: parseFloat(row[4]),
//     supplier: row[5],
//     paid: row[6] === 'true',
//   }))
// }

// export async function addExpense(expense: any) {
//   const values = [
//     [
//       Date.now(), // Use timestamp as ID
//       expense.date,
//       expense.category,
//       expense.description,
//       expense.amount,
//       expense.supplier,
//       expense.paid ? 'true' : 'false',
//       '1', // Active status
//     ],
//   ]

//   await sheets.spreadsheets.values.append({
//     spreadsheetId: SPREADSHEET_ID,
//     range: 'Expenses!A2:H',
//     valueInputOption: 'USER_ENTERED',
//     requestBody: {
//       values,
//     },
//   })
// }

// export async function deleteExpense(id: number) {
//   const expenses = await fetchExpenses()
//   const rowIndex = expenses.findIndex((expense) => expense.id === id)

//   if (rowIndex === -1) {
//     throw new Error('Expense not found')
//   }

//   await sheets.spreadsheets.values.update({
//     spreadsheetId: SPREADSHEET_ID,
//     range: `Expenses!H${rowIndex + 2}`,
//     valueInputOption: 'RAW',
//     requestBody: {
//       values: [['0']], // Set status to inactive
//     },
//   })
// }

// export async function fetchSupplierDebts() {
//   const expenses = await fetchExpenses()
//   const debts = expenses
//     .filter((expense) => !expense.paid)
//     .reduce((acc: any, expense) => {
//       if (!acc[expense.supplier]) {
//         acc[expense.supplier] = 0
//       }
//       acc[expense.supplier] += expense.amount
//       return acc
//     }, {})

//   return Object.entries(debts).map(([supplier, amount]) => ({
//     supplier,
//     amount: amount as number,
//   }))
// }

// export async function fetchTasks() {
//   const response = await sheets.spreadsheets.values.get({
//     spreadsheetId: SPREADSHEET_ID,
//     range: 'Tasks!A2:E',
//   })

//   const rows = response.data.values

//   if (!rows || rows.length === 0) {
//     return []
//   }

//   return rows.map((row: any) => ({
//     id: parseInt(row[0]),
//     name: row[1],
//     startDate: new Date(row[2]),
//     endDate: new Date(row[3]),
//     status: row[4],
//   }))
// }

