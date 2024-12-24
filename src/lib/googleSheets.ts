import { google } from 'googleapis'

console.log("process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'):", process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'))
console.log("process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL:", process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL)
const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
export const sheets = google.sheets({ version: 'v4', auth });

export const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;

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
            client_email: process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    let range = "Tareas!A:Z"
    console.log("process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID:", process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID)
    const sheetTitle = await getSheetTitleById(sheets, process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID as string, sheetId || "0");
    if (sheetTitle) {
        range = `${sheetTitle}!A:Z`;
    }
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
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