"use client";

// import { useEffect, useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// export default function ExpenseSummary() {
//   const [totalExpenses, setTotalExpenses] = useState(0)

//   useEffect(() => {
//     // Aquí cargaríamos los gastos desde una API o base de datos
//     // Por ahora, usaremos un valor de ejemplo
//     setTotalExpenses(15000)
//   }, [])

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Resumen de Gastos</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <p className="text-3xl font-bold">${totalExpenses.toLocaleString()}</p>
//       </CardContent>
//     </Card>
//   )
// }

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";
import { Expense } from "@/types";
import { Skeleton } from "./ui/skeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ExpenseSummary() {
	const [totalExpenses, setTotalExpenses] = useState(0);
	const {
		data: expenses,
		error,
		isLoading,
		mutate,
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
			  <Skeleton className="h-8 w-[120px]" />
			</CardContent>
		  </Card>
		)
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
			<CardHeader>
				<CardTitle>Resumen de Gastos</CardTitle>
			</CardHeader>
			<CardContent>
				<p className='text-3xl font-bold whitespace-nowrap'>
					$ 
					{new Intl.NumberFormat("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}).format(totalExpenses)}
				</p>
			</CardContent>
		</Card>
	);
}
