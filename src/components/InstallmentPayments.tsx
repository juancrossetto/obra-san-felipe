"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Installment } from "@/types";
import useSWR from "swr";
import { Skeleton } from "./ui/skeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function InstallmentPayments() {
	const {
		data: payments,
        isLoading,
	} = useSWR<Installment[]>("/api/installments", fetcher);
	const total = payments?.reduce((sum, payment) => sum + payment.amount, 0);
    if (isLoading) {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Pagos Lote (85k)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        )
      }
	return (
		<Card className='mt-3'>
			<CardHeader>
				<CardTitle>Pagos Lote (85k)</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Mes</TableHead>
								<TableHead>Cuota</TableHead>
								<TableHead className='text-right'>Monto (USD)</TableHead>
								<TableHead>Fecha de Pago</TableHead>
								<TableHead>Estado</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{payments?.map((payment, index) => (
								<TableRow key={index}>
									<TableCell>{payment.date}</TableCell>
									<TableCell>{payment.installment}</TableCell>
									<TableCell className='text-right whitespace-nowrap'>
										${" "}
										{new Intl.NumberFormat("en-US", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										}).format(payment.amount)}
									</TableCell>
									<TableCell>{payment.dueDate}</TableCell>
									<TableCell>
										<Badge
											className={
												payment.isPaid
													? "bg-emerald-500 text-white"
													: "bg-red-500 text-white cursor-pointer"
											}
										>
											{payment.isPaid ? "Pagada" : "Pendiente"}
										</Badge>
									</TableCell>
								</TableRow>
							))}
							<TableRow>
								<TableCell colSpan={2} className='font-bold'>
									TOTAL
								</TableCell>
								<TableCell className='text-right font-bold'>
									${" "}
									{new Intl.NumberFormat("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									}).format(total || 0)}
								</TableCell>
								<TableCell colSpan={2}></TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
