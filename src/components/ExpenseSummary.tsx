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
	const [totalAlexxPayments, setTotalAlexxPayments] = useState(0);
	const [totalGusPayments, setTotalGusPayments] = useState(0);
	const [totalOtherPayments, setTotalOtherPayments] = useState(0);
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
			const total = payments
				.filter((p) => p.paidTo?.toLowerCase() === "alexx")
				?.reduce((sum, payment) => sum + payment.amount, 0); // Asume que `amount` existe en `payments`
			setTotalAlexxPayments(total);

			const totalGus = payments
				.filter((p) => p.paidTo?.toLowerCase() === "gustavo")
				?.reduce((sum, payment) => sum + payment.amount, 0);
			setTotalGusPayments(totalGus);

			const totalOther = payments
				.filter(
					(p) =>
						p.paidTo?.toLowerCase() !== "alexx" &&
						p.paidTo?.toLowerCase() !== "gustavo"
				)
				?.reduce((sum, payment) => sum + payment.amount, 0); // Asume que `amount` existe en `payments`
			setTotalOtherPayments(totalOther);
		}
	}, [expenses, payments]);

	useEffect(() => {
		setTotalCombined(totalExpenses + totalAlexxPayments + totalOtherPayments);
	}, [totalExpenses, totalAlexxPayments, totalOtherPayments]);

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
				<div className='flex justify-between mt-2 text-xs flex-wrap justify-evenly'>
					<div className='text-center'>
						<p className='text-muted-foreground'>Materiales</p>
						<p className='font-medium'>${formatNumber(totalExpenses)}</p>
					</div>
					<div className='text-center'>
						<p className='text-muted-foreground'>Pagos a Alexx</p>
						<p className='font-medium'>${formatNumber(totalAlexxPayments)}</p>
					</div>
					<div className='text-center'>
						<p className='text-muted-foreground'>Otros Pagos</p>
						<p className='font-medium'>${formatNumber(totalOtherPayments)}</p>
					</div>
				</div>
				<div className='flex justify-between mt-2 text-xs flex-wrap justify-evenly'>
					<div className='text-center'></div>
					<div className='text-center'>
						<p className='text-muted-foreground'>Pagos a Gus</p>
						<p className='font-medium'>${formatNumber(totalGusPayments)}</p>
					</div>
					<div className='text-center'></div>
				</div>
			</CardContent>
		</Card>
	);
}
