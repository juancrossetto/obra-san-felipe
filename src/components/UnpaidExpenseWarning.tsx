"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import moment from "moment";
import { Expense } from "@/types";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

interface UnpaidExpense {
	id: number;
	description: string;
	amount: number;
	date: string;
	supplier: string;
}

export default function UnpaidExpenseWarning() {
	const {
		data: expenses,
		error,
		isLoading,
	} = useSWR<Expense[]>("/api/expenses", fetcher);
	const { toast } = useToast();

	useEffect(() => {
		const checkUnpaidExpenses = async () => {
			const now = moment();
			const unpaid = expenses?.filter((expense) => {
				const expenseDate = moment(expense.date, "DD/MM/YYYY");
				const daysDiff = now.diff(expenseDate, "days");
				return !expense.paid && daysDiff >= 20 && daysDiff < 30;
			});

			if (unpaid && unpaid.length > 0) {
				toast({
					variant: "destructive",
					title: "Advertencia de Pagos Pendientes",
					description: (
						<div>
							<p className='mb-2'>
								Los siguientes gastos están próximos a cumplir un mes sin ser
								pagados:
							</p>
							<ul className='list-disc pl-5 mb-2'>
								{unpaid.map((expense) => (
									<li key={expense.id}>
										{expense.description} - ${expense.amount.toLocaleString()} (
										{expense.supplier})
									</li>
								))}
							</ul>
							<p>
								Por favor, realice el pago a los proveedores lo antes posible.
							</p>
						</div>
					),
					duration: 10000, // 10 seconds
				});
			}
		};

		checkUnpaidExpenses();
	}, [toast, expenses]);

	return null;
}
