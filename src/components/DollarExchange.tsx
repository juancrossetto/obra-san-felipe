"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";
import { Skeleton } from "./ui/skeleton";

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
			<Card>
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
		<Card>
			<CardHeader>
				<CardTitle>Cotización del Dólar Oficial</CardTitle>
			</CardHeader>
			<CardContent>
				{dollarRate ? (
					<div>
						<p>Compra: ${dollarRate.compra}</p>
						<p>Venta: ${dollarRate.venta}</p>
						<p>
							Fecha: {moment(dollarRate.fecha).format("DD/MM/YYYY HH:mm:ss")}
						</p>
					</div>
				) : (
					<p>Error al cargar la cotización</p>
				)}
			</CardContent>
		</Card>
	);
}
