"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
} from "recharts";
import moment from "moment";
import useSWR from "swr";
import { Expense } from "@/types";
import { fetcher } from "@/lib/utils";

interface ChartData {
	date: string;
	amount: number;
}

export default function DailyExpenseChart() {
	const {
		data: expenses,
		error,
		mutate,
		isLoading,
	} = useSWR<Expense[]>("/api/expenses", fetcher);
	const [chartData, setChartData] = useState<ChartData[]>([]);
	// const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (expenses?.length) {
			const sortedExpenses = expenses.sort(
				(a, b) =>
					moment(a.date, "DD/MM/YYYY").valueOf() -
					moment(b.date, "DD/MM/YYYY").valueOf()
			);

			const dailyData = sortedExpenses.reduce(
				(acc: ChartData[], expense: Expense) => {
					const existingDay = acc.find((item) => item.date === expense.date);
					if (existingDay) {
						existingDay.amount += expense.amount;
					} else {
						acc.push({ date: expense.date, amount: expense.amount });
					}
					return acc;
				},
				[]
			);

			setChartData(dailyData);
		}
	}, [expenses]);

	if (isLoading) {
		return (
			<Card className='animate-pulse'>
				<CardHeader>
					<CardTitle>Gastos Acumulados</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='w-full h-[400px]'>
						<Skeleton className='w-full h-full' />
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='animate-fade-in'>
			<CardHeader>
				<CardTitle className='text-primary'>Gastos Diarios</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='w-full h-[400px]'>
					<ResponsiveContainer width='100%' height='100%'>
						<BarChart
							data={chartData}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
							<XAxis
								dataKey='date'
								tickFormatter={(value) =>
									moment(value, "DD/MM/YYYY").format("DD/MM")
								}
								stroke='var(--foreground)'
							/>
							<YAxis
								stroke='var(--foreground)'
								tickFormatter={(value) => `$${value.toLocaleString()}`}
							/>
							<Tooltip
								labelFormatter={(value) => `Fecha: ${value}`}
								formatter={(value: number) => [
									`$${value.toLocaleString()}`,
									"Gasto Diario",
								]}
								contentStyle={{
									backgroundColor: "var(--background)",
									border: "1px solid var(--border)",
									borderRadius: "4px",
									color: "var(--foreground)",
								}}
							/>
							<Bar dataKey='amount' fill='#3b82f6' />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
