"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";
import { Expense, Payment, Task } from "@/types";
import { Skeleton } from "./ui/skeleton";
import { DollarSign } from "lucide-react";
import { fetcher, formatNumber } from "@/lib/utils";
import { numberToWords } from "@/lib/numberToLetters";

export default function ExpenseSummary() {
	const [totalExpenses, setTotalExpenses] = useState(0);
	const [totalPayments, setTotalPayments] = useState(0);
	const [totalCombined, setTotalCombined] = useState(0);
	const {
		data: expenses,
		error,
		isLoading,
	} = useSWR<Expense[]>("/api/expenses", fetcher);
	const {
		data: payments,
		mutate,
		isLoading: isLoadingPayments,
	} = useSWR<Payment[]>("/api/payments", fetcher);

	useEffect(() => {
		if (expenses) {
			const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
			setTotalExpenses(total);
		}
		if (payments) {
			const total = payments.reduce((sum, payment) => sum + payment.amount, 0); // Asume que `amount` existe en `payments`
			setTotalPayments(total);
		}
	}, [expenses, payments]);

	useEffect(() => {
		setTotalCombined(totalExpenses + totalPayments);
	  }, [totalExpenses, totalPayments]);

	if (isLoading || isLoadingPayments) {
		return (
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>Resumen de Gastos</CardTitle>
				</CardHeader>
				<CardContent>
					<Skeleton className='h-8 w-[120px]' />
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Error</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-red-500'>No se pudieron cargar los datos</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='animate-fade-in w-full'>
			<CardHeader className='flex flex-row items-center justify-between pb-2'>
				<CardTitle className='text-sm font-medium'>Gastos Totales</CardTitle>
				<DollarSign className='h-4 w-4 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<div className='text-xl font-semibold text-center'>
					${formatNumber(totalCombined)}
					<p className='text-xs text-muted-foreground capitalize'>
						{numberToWords(totalCombined)}
					</p>
				</div>
				<div className='flex justify-between mt-2 text-sm'>
					<div className='text-center'>
						<p className='text-muted-foreground'>Materiales</p>
						<p className='font-medium'>${formatNumber(totalExpenses)}</p>
					</div>
					<div className='text-center'>
						<p className='text-muted-foreground'>Pagos</p>
						<p className='font-medium'>${formatNumber(totalPayments)}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
