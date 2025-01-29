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
    status: 'Finalizada' | 'En Proceso' | 'Pendiente' | 'Cancelada',
    progress: number
}

export interface Installment {
    date: string
    installment: string
    amount: number
    dueDate: string
    isPaid: boolean
}

export interface Payment {
    id: number
    description: string
    paymentMethod: string
    date: string
    amount: number
    paidTo: string
    daysWorked: number
    paydDays: number
  }
