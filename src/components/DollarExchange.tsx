"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";
import { Skeleton } from "./ui/skeleton";
import { ArrowUpDown } from "lucide-react";

interface DollarRate {
	compra: number;
	venta: number;
	fecha: string;
}

export default function DollarExchange() {
	const [dollarRate, setDollarRate] = useState<DollarRate | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDollarRate = async () => {
			try {
				const response = await fetch("https://dolarapi.com/v1/dolares/blue");
				const data = await response.json();
				setDollarRate(data);
			} catch (error) {
				console.error("Error fetching dollar rate:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchDollarRate();
	}, []);
	if (loading) {
		return (
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>Cotización del Dólar Blue</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<Skeleton className='h-4 w-24' />
					<Skeleton className='h-4 w-24' />
					<Skeleton className='h-4 w-32' />
				</CardContent>
			</Card>
		);
	}
	return (
		<Card className='animate-fade-in w-full'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>Dólar Blue</CardTitle>
				<ArrowUpDown className='h-4 w-4 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				{dollarRate ? (
					<div className='space-y-1'>
						<div className='text-2xl font-bold'>
							${dollarRate.venta.toFixed(2)}
						</div>
						<p className='text-xs text-muted-foreground'>
							Compra: ${dollarRate.compra.toFixed(2)} | Actualizado:{" "}
							{moment(dollarRate.fecha).format("DD/MM/YYYY HH:mm:ss")}
						</p>
					</div>
				) : (
					<p className='text-sm text-muted-foreground'>
						Error al cargar la cotización
					</p>
				)}
			</CardContent>
		</Card>
	);
}
