"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import useSWR from "swr";
import { Expense } from "@/types";
import { Skeleton } from "./ui/skeleton";
import { fetcher, formatNumber } from "@/lib/utils";

export default function SupplierDebts() {
	const {
		data: expenses,
		error,
		isLoading,
	} = useSWR<Expense[]>("/api/expenses", fetcher);

	const debts = useMemo(() => {
		if (!expenses) return [];
		const filteredDebts = expenses
			.filter((expense) => !expense.paid && expense.id !== 0)
			.reduce((acc: Record<string, number>, expense) => {
				if (!acc[expense.supplier]) {
					acc[expense.supplier] = 0;
				}
				acc[expense.supplier] += expense.amount;
				return acc;
			}, {});

		return Object.entries(filteredDebts).map(([supplier, amount]) => ({
			supplier,
			amount,
		}));
	}, [expenses]);

	if (isLoading) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Deudas con Proveedores</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-2'>
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-full' />
					</div>
				</CardContent>
			</Card>
		);
	}
	if (error) return <div>Error cargando las deudas</div>;

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Deudas con Proveedores</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Proveedor</TableHead>
							<TableHead className='text-right'>Monto Adeudado</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{debts.map((debt, index) => (
							<TableRow key={index}>
								<TableCell>{debt.supplier}</TableCell>
								<TableCell className='text-right whitespace-nowrap'>
									$ {formatNumber(debt.amount)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
