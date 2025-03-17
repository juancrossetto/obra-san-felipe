"use client";

import { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import moment from "moment";
import { Payment } from "@/types";
import { fetcher, formatNumber } from "@/lib/utils";
import useSWR from "swr";

interface PaymentsListProps {
	directedBy: string;
}

export default function PaymentsList({ directedBy }: PaymentsListProps) {
	const {
		data: payments,
		error,
		mutate,
		isLoading,
	} = useSWR<Payment[]>("/api/payments", fetcher);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
	const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
	const [isAddFormVisible, setIsAddFormVisible] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const isDesktop = useMediaQuery("(min-width: 768px)");

	// useEffect(() => {
	// 	const loadPayments = async () => {
	// 		const fetchedPayments = await fetchPayments();
	// 		setPayments(fetchedPayments);
	// 	};
	// 	loadPayments();
	// }, []);

	// const handleAddPayment = async (e: React.FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault();
	// 	const formData = new FormData(e.currentTarget);
	// 	const newPayment = {
	// 		amount: Number(formData.get("amount")),
	// 		date: moment(formData.get("date") as string).format("DD/MM/YYYY"),
	// 		description: formData.get("description") as string,
	// 		paymentMethod: formData.get("paymentMethod") as string,
	// 		paidTo: formData.get("paidTo") as string,
	// 	};
	// 	await addPayment(newPayment);
	// 	setPayments(await fetchPayments());
	// 	setIsAddDialogOpen(false);
	// 	setIsAddFormVisible(false);
	// };

	// const handleEditPayment = async (e: React.FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault();
	// 	if (!currentPayment) return;
	// 	const formData = new FormData(e.currentTarget);
	// 	const updatedPayment = {
	// 		amount: Number(formData.get("amount")),
	// 		date: moment(formData.get("date") as string).format("DD/MM/YYYY"),
	// 		description: formData.get("description") as string,
	// 		paymentMethod: formData.get("paymentMethod") as string,
	// 		paidTo: formData.get("paidTo") as string,
	// 	};
	// 	await editPayment(currentPayment.id, updatedPayment);
	// 	setPayments(await fetchPayments());
	// 	setIsEditDialogOpen(false);
	// };

	// const handleDeletePayment = async (id: number) => {
	// 	await deletePayment(id);
	// 	setPayments(await fetchPayments());
	// };

	const handleAddPayment = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const newPayment = {
			amount: Number(formData.get("amount")),
			date: moment(formData.get("date") as string).format("DD/MM/YYYY"),
			description: formData.get("description") as string,
			paymentMethod: formData.get("paymentMethod") as string,
		};
		const response = await fetch("/api/payments", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newPayment),
		});

		if (!response.ok) {
			throw new Error("Error adding payment");
		}
		mutate();
		setIsAddDialogOpen(false);
	};

	const handleEditPayment = async (
		e: React.FormEvent<HTMLFormElement>,
		currentPayment: Payment | null
	) => {
		e.preventDefault();
		setIsEditing(true);
		if (!currentPayment) return;

		const formData = new FormData(e.currentTarget);
		const updatedPayment = {
			amount: Number(formData.get("amount")),
			date: moment(formData.get("date") as string).format("DD/MM/YYYY"),
			description: formData.get("description") as string,
			paymentMethod: formData.get("paymentMethod") as string,
		};
		// const updatedPayment = {
		// 	amount: Number(currentPayment.amount),
		// 	date: moment(currentPayment.date as string).format("DD/MM/YYYY"),
		// 	description: currentPayment.description as string,
		// 	paymentMethod: currentPayment.paymentMethod as string,
		// };

		try {
			await fetch("/api/payments", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					rowIndex: currentPayment.id,
					updatedPayment: updatedPayment,
				}),
			});
			mutate(); // Refresca los datos después de editar
			setIsEditDialogOpen(false);
		} catch (error) {
			console.error("Error editing payment:", error);
		} finally {
			setIsEditing(false);
		}

		// await editPayment(currentPayment.id, updatedPayment)
		// setPayments(await fetchPayments())
		// setIsEditDialogOpen(false)
	};

	const handleDeletePayment = async (id: number) => {
		try {
			setIsDeleting(true);
			await fetch("/api/payments", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				// body: JSON.stringify({ id }),
				body: JSON.stringify({
					rowIndex: id,
				}),
			});
			mutate(); // Refresca los datos después de eliminar
		} catch (error) {
			console.error("Error deleting payment:", error);
		} finally {
			setIsDeleting(false); // Indica que la operación ha terminado
		}
	};

	const renderPaymentItem = (payment: Payment) => (
		<div key={payment.id} className='bg-white p-4 rounded-lg shadow mb-4'>
			<div className='flex justify-between items-center mb-2'>
				<h3 className='text-lg font-semibold'>{payment.description}</h3>
				<span className='text-lg font-bold whitespace-nowrap'>
					${formatNumber(payment.amount)}
				</span>
			</div>
			<p className='text-sm text-gray-600 mb-1'>Fecha: {payment.date}</p>
			<p className='text-sm mb-1'>Forma de pago: {payment.paymentMethod}</p>
			<p className='text-sm mb-2'>Pagado a: {payment.paidTo}</p>
			<div className='flex space-x-2'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => {
						setCurrentPayment(payment);
						setIsEditDialogOpen(true);
					}}
				>
					{isEditing ? "Editando..." : "Editar"}
				</Button>
				<Button
					variant='destructive'
					size='sm'
					onClick={() => handleDeletePayment(payment.id)}
				>
					{isDeleting ? "Eliminando..." : "Eliminar"}
				</Button>
			</div>
		</div>
	);

	const renderPaymentsTable = (payments: Payment[]) => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Fecha</TableHead>
					<TableHead>Descripción</TableHead>
					<TableHead>Forma de Pago</TableHead>
					<TableHead>Pagado a</TableHead>
					<TableHead className='text-right'>Monto</TableHead>
					<TableHead>Acciones</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{payments.map((payment) => (
					<TableRow key={payment.id}>
						<TableCell>{payment.date}</TableCell>
						<TableCell>{payment.description}</TableCell>
						<TableCell>{payment.paymentMethod}</TableCell>
						<TableCell>{payment.paidTo}</TableCell>
						<TableCell className='text-right'>
							${formatNumber(payment.amount)}
						</TableCell>
						<TableCell>
							<div className='flex space-x-2'>
								<Button
									variant='outline'
									size='sm'
									onClick={() => {
										setCurrentPayment(payment);
										setIsEditDialogOpen(true);
									}}
								>
									{isEditing ? "Editando..." : "Editar"}
								</Button>
								<Button
									variant='destructive'
									size='sm'
									onClick={() => handleDeletePayment(payment.id)}
								>
									{isDeleting ? "Eliminando..." : "Eliminar"}
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);

	const paymentsByDirected = (payments || []).filter(
		(payment) => payment.paidTo === directedBy
	);
	const otherPayments = (payments || []).filter(
		(payment) => payment.paidTo !== directedBy
	);

	return (
		<div>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-2xl font-bold text-primary'>Lista de Pagos</h2>
				<div className='flex items-center space-x-2'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant='outline'
									size='icon'
									onClick={() => setIsImageDialogOpen(true)}
								>
									<FileText className='h-4 w-4' />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Ver presupuesto firmado</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<Button onClick={() => setIsAddFormVisible(!isAddFormVisible)}>
						{isAddFormVisible ? "Cerrar formulario" : "Agregar Pago"}
					</Button>
				</div>
			</div>

			{isAddFormVisible && (
				<Card className='mb-6'>
					<CardHeader>
						<CardTitle>Agregar Nuevo Pago</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleAddPayment}>
							<div className='grid gap-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<Label htmlFor='amount'>Monto</Label>
										<Input id='amount' name='amount' type='number' required />
									</div>
									<div>
										<Label htmlFor='date'>Fecha</Label>
										<Input id='date' name='date' type='date' required />
									</div>
								</div>
								<div>
									<Label htmlFor='description'>Descripción</Label>
									<Input id='description' name='description' required />
								</div>
								<div>
									<Label htmlFor='paymentMethod'>Forma de Pago</Label>
									<Input id='paymentMethod' name='paymentMethod' required />
								</div>
								<div>
									<Label htmlFor='paidTo'>Pagado a</Label>
									<Input id='paidTo' name='paidTo' required />
								</div>
								<Button type='submit'>Agregar Pago</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}

			<Card className='mb-6'>
				<CardHeader>
					<CardTitle>Pagos a {directedBy}</CardTitle>
				</CardHeader>
				<CardContent>
					{isDesktop
						? renderPaymentsTable(paymentsByDirected)
						: paymentsByDirected.map(renderPaymentItem)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Otros Pagos</CardTitle>
				</CardHeader>
				<CardContent>
					{isDesktop
						? renderPaymentsTable(otherPayments)
						: otherPayments.map(renderPaymentItem)}
				</CardContent>
			</Card>

			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Editar Pago</DialogTitle>
					</DialogHeader>
					<form onSubmit={(e) => handleEditPayment(e, currentPayment)}>
						<div className='grid gap-4 py-4'>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='edit-amount' className='text-right'>
									Monto
								</Label>
								<Input
									id='edit-amount'
									name='amount'
									type='number'
									className='col-span-3'
									defaultValue={currentPayment?.amount}
									required
								/>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='edit-date' className='text-right'>
									Fecha
								</Label>
								<Input
									id='edit-date'
									name='date'
									type='date'
									className='col-span-3'
									defaultValue={
										currentPayment
											? moment(currentPayment.date, "DD/MM/YYYY").format(
													"YYYY-MM-DD"
											  )
											: ""
									}
									required
								/>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='edit-description' className='text-right'>
									Descripción
								</Label>
								<Input
									id='edit-description'
									name='description'
									className='col-span-3'
									defaultValue={currentPayment?.description}
									required
								/>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='edit-paymentMethod' className='text-right'>
									Forma de Pago
								</Label>
								<Input
									id='edit-paymentMethod'
									name='paymentMethod'
									className='col-span-3'
									defaultValue={currentPayment?.paymentMethod}
									required
								/>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='edit-paidTo' className='text-right'>
									Pagado a
								</Label>
								<Input
									id='edit-paidTo'
									name='paidTo'
									className='col-span-3'
									defaultValue={currentPayment?.paidTo}
									required
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type='submit'>Guardar Cambios</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
				<DialogContent className='max-w-3xl'>
					<DialogHeader>
						<DialogTitle>Presupuesto Firmado</DialogTitle>
					</DialogHeader>
					<div className='relative h-[60vh]'>
						<Image
							src='/placeholder.svg?height=800&width=600'
							alt='Presupuesto firmado'
							layout='fill'
							objectFit='contain'
						/>
					</div>
					<DialogFooter>
						<Button onClick={() => setIsImageDialogOpen(false)}>Cerrar</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
