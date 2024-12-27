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
// import { fetchPayments, addPayment, deletePayment, editPayment } from '@/lib/payments'
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText } from "lucide-react";
import Image from "next/image";
import { Payment } from "@/types";
import useSWR from "swr";
import moment from "moment";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PaymentsList() {
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
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const isDesktop = useMediaQuery("(min-width: 768px)");

	//   useEffect(() => {
	//     const loadPayments = async () => {
	//       const fetchedPayments = await fetchPayments()
	//       setPayments(fetchedPayments)
	//     }
	//     loadPayments()
	//   }, [])

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
					$
					{new Intl.NumberFormat("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}).format(payment.amount)}
				</span>
			</div>
			<p className='text-sm text-gray-600 mb-1'>Fecha: {payment.date}</p>
			<p className='text-sm mb-2'>Forma de pago: {payment.paymentMethod}</p>
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

	return (
		<div>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-2xl font-bold text-primary'>Lista de Pagos</h2>
				<div className='flex items-center space-x-2'>
					<Button onClick={() => setIsAddDialogOpen(true)}>Agregar Pago</Button>
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
				</div>
			</div>
			{isDesktop ? (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Fecha</TableHead>
							<TableHead>Descripción</TableHead>
							<TableHead>Forma de Pago</TableHead>
							<TableHead className='text-right'>Monto</TableHead>
							<TableHead>Acciones</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{payments?.map((payment) => (
							<TableRow key={payment.id}>
								<TableCell>{payment.date}</TableCell>
								<TableCell>{payment.description}</TableCell>
								<TableCell>{payment.paymentMethod}</TableCell>
								<TableCell className='text-right whitespace-nowrap'>
									$
									{new Intl.NumberFormat("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									}).format(payment.amount)}
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
			) : (
				<div className='space-y-4'>{payments?.map(renderPaymentItem)}</div>
			)}

			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Agregar Pago</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleAddPayment}>
						<div className='grid gap-4 py-4'>
							<div className='grid grid-cols-4 items-center gap-4'>
								<label htmlFor='amount' className='text-right'>
									Monto
								</label>
								<Input
									id='amount'
									name='amount'
									type='number'
									className='col-span-3'
									required
								/>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<label htmlFor='date' className='text-right'>
									Fecha
								</label>
								<Input
									id='date'
									name='date'
									type='date'
									className='col-span-3'
									required
								/>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<label htmlFor='description' className='text-right'>
									Descripción
								</label>
								<Input
									id='description'
									name='description'
									className='col-span-3'
									required
								/>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<label htmlFor='paymentMethod' className='text-right'>
									Forma de Pago
								</label>
								<Input
									id='paymentMethod'
									name='paymentMethod'
									className='col-span-3'
									required
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type='submit'>Agregar Pago</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Editar Pago</DialogTitle>
					</DialogHeader>
					<form onSubmit={(e) => handleEditPayment(e, currentPayment)}>
						<div className='grid gap-4 py-4'>
							<div className='grid grid-cols-4 items-center gap-4'>
								<label htmlFor='edit-amount' className='text-right'>
									Monto
								</label>
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
								<label htmlFor='edit-date' className='text-right'>
									Fecha
								</label>
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
								<label htmlFor='edit-description' className='text-right'>
									Descripción
								</label>
								<Input
									id='edit-description'
									name='description'
									className='col-span-3'
									defaultValue={currentPayment?.description}
									required
								/>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<label htmlFor='edit-paymentMethod' className='text-right'>
									Forma de Pago
								</label>
								<Input
									id='edit-paymentMethod'
									name='paymentMethod'
									className='col-span-3'
									defaultValue={currentPayment?.paymentMethod}
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
							src='/presupuesto.png'
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
