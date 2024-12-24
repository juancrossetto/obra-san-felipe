export interface Expense {
    id: number
    amount: number
    category: string
    description: string
    date: string
    supplier: string
    paid: boolean
    images: string[]
}

export interface Task {
    id: number
    name: string
    startDate: string
    endDate: string
    status: 'Finalizada' | 'En Proceso' | 'Pendiente'
}

export interface Installment {
    date: string
    installment: string
    amount: number
    dueDate: string
    isPaid: boolean
  }
