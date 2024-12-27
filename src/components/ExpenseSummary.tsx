"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";
import { Expense } from "@/types";
import { Skeleton } from "./ui/skeleton";
import { DollarSign } from "lucide-react";
import { fetcher, formatNumber } from "@/lib/utils";
import { numberToWords } from "@/lib/numberToLetters";

export default function ExpenseSummary() {
	const [totalExpenses, setTotalExpenses] = useState(0);
	const {
		data: expenses,
		error,
		isLoading,
	} = useSWR<Expense[]>("/api/expenses", fetcher);

	useEffect(() => {
		if (expenses) {
			// Calculate total amount
			const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
			setTotalExpenses(total);
		}
	}, [expenses]);

	if (isLoading) {
		return (
			<Card>
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
		<Card>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>Gastos Totales</CardTitle>
				<DollarSign className='h-4 w-4 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>${formatNumber(totalExpenses)}</div>
				{/* <p className='text-xs text-muted-foreground'>+20.1% del mes pasado</p> */}
				<p className='text-xs text-muted-foreground capitalize'>
					{numberToWords(totalExpenses)}
				</p>
			</CardContent>
		</Card>
	);
}
