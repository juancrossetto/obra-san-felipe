"use client";

import { useState } from "react";
import useSWR from "swr";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Expense } from "@/types";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Skeleton } from "./ui/skeleton";
import { X } from "lucide-react";
import { capitalizeText } from "@/lib/utils";

type EditableExpense = Expense & {
	rowIndex: number; // Añade rowIndex al tipo
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ExpenseList() {
	const {
		data: expenses,
		error,
		mutate,
		isLoading,
	} = useSWR<Expense[]>("/api/expenses", fetcher);
	const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);
	const [expenseToEdit, setExpenseToEdit] = useState<EditableExpense | null>(
		null
	);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [newImages, setNewImages] = useState<File[]>([]);

	const isLargeScreen = useMediaQuery("(min-width: 1200px)");
	const categories: string[] = Array.from(
		new Set(expenses?.map((e: Expense) => capitalizeText(e.category)) || [])
	);

	const handleDelete = async (id: number) => {
		try {
			setIsDeleting(true);
			await fetch("/api/expenses", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				// body: JSON.stringify({ id }),
				body: JSON.stringify({
					rowIndex: id,
				}),
			});
			mutate(); // Refresca los datos después de eliminar
			setExpenseToDelete(null);
		} catch (error) {
			console.error("Error deleting expense:", error);
		} finally {
			setIsDeleting(false); // Indica que la operación ha terminado
		}
	};

	const handleEditSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsEditing(true);
		if (!expenseToEdit) return;

		try {
			if (newImages?.length > 0) {
				const newImageUrls = newImages.map((image) =>
					URL.createObjectURL(image)
				);
				expenseToEdit.images = [
					...(expenseToEdit.images || []),
					...newImageUrls,
				];
			}
			await fetch("/api/expenses", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					rowIndex: expenseToEdit.rowIndex, // Asegúrate de que expenseToEdit tenga esta propiedad
					updatedExpense: expenseToEdit,
				}),
			});
			mutate(); // Refresca los datos después de editar
			setIsEditDialogOpen(false);
			setExpenseToEdit(null);
			setNewImages([]);
		} catch (error) {
			console.error("Error editing expense:", error);
		} finally {
			setIsEditing(false);
		}
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setNewImages((prevImages) => [
				...prevImages,
				...Array.from(e.target.files as FileList),
			]);
		}
	};

	const removeImage = (index: number) => {
		if (expenseToEdit) {
			const updatedImages = [...expenseToEdit.images];
			updatedImages.splice(index, 1);
			setExpenseToEdit({ ...expenseToEdit, images: updatedImages });
		}
	};

	const removeNewImage = (index: number) => {
		setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
	};

	// const handleEdit = async (expense: Expense) => {
	// 	setExpenseToEdit(expense);
	// 	setIsEditDialogOpen(true);
	// };

	const handleEdit = (expense: Expense, index: number) => {
		setExpenseToEdit({ ...expense, rowIndex: index + 2 }); // Agrega el índice al objeto
		setIsEditDialogOpen(true);
	};

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Lista de Gastos</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-2'>
						{Array.from({ length: 5 }).map((_, index) => (
							<Skeleton key={index} className='h-12 w-full' />
						))}
					</div>
				</CardContent>
			</Card>
		);
	}
	if (error) return <div>Error loading expenses</div>;

	return (
		<div>
			<h2 className='text-2xl font-bold mb-4'>Lista de Gastos</h2>
			<div className='overflow-x-auto'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Fecha</TableHead>
							<TableHead>Categoría</TableHead>
							{isLargeScreen && <TableHead>Descripción</TableHead>}
							<TableHead>Proveedor</TableHead>
							<TableHead>Pagado</TableHead>
							<TableHead className='text-right'>Monto</TableHead>
							<TableHead>Imágenes</TableHead>
							<TableHead>Acciones</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{expenses?.map((expense, index) => (
							<TableRow key={index}>
								<TableCell>{expense.date}</TableCell>
								<TableCell>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<span>{expense.category}</span>
											</TooltipTrigger>
											{!isLargeScreen && (
												<TooltipContent>
													<p>{expense.description}</p>
												</TooltipContent>
											)}
										</Tooltip>
									</TooltipProvider>
								</TableCell>
								{isLargeScreen && <TableCell>{expense.description}</TableCell>}
								<TableCell>{expense.supplier}</TableCell>
								<TableCell>
									<Badge
										className={
											expense.paid
												? "bg-emerald-500 text-white"
												: "bg-red-500 text-white cursor-pointer"
										}
									>
										{expense.paid ? "Si" : "No"}
									</Badge>
								</TableCell>
								<TableCell className='text-right whitespace-nowrap'>
									${" "}
									{new Intl.NumberFormat("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									}).format(expense.amount)}
								</TableCell>
								<TableCell>
									{expense?.images?.length > 0 && (
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button variant='outline' size='sm'>
														Ver {expense.images.length} imagen(es)
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													<div className='flex gap-2'>
														{expense.images?.map((image, index) => (
															<img
																key={index}
																src={image}
																alt={`Imagen ${index + 1}`}
																className='w-16 h-16 object-cover'
															/>
														))}
													</div>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									)}
								</TableCell>
								<TableCell>
									<div className='flex space-x-2'>
										<Button
											variant='outline'
											size='sm'
											onClick={() => handleEdit(expense, index)}
										>
											Editar
										</Button>
										<Dialog>
											<DialogTrigger asChild>
												<Button
													variant='secondary'
													size='sm'
													onClick={() => setExpenseToDelete(expense.id)}
												>
													Eliminar
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Confirmar eliminación</DialogTitle>
													<DialogDescription>
														¿Estás seguro de que quieres eliminar este gasto?
														Esta acción no se puede deshacer.
													</DialogDescription>
												</DialogHeader>
												<DialogFooter>
													<Button
														variant='outline'
														onClick={() => setExpenseToDelete(null)}
													>
														Cancelar
													</Button>
													<Button
														variant='destructive'
														onClick={() => handleDelete(expense.id)}
														disabled={isDeleting}
													>
														{isDeleting ? "Eliminando..." : "Eliminar"}
													</Button>
												</DialogFooter>
											</DialogContent>
										</Dialog>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Editar Gasto</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleEditSubmit}>
						<div className='grid gap-4 py-4'>
							<div className='grid grid-cols-4 items-center gap-4'>
								<label htmlFor='amount' className='text-right'>
									Monto
								</label>
								<Input
									id='amount'
									type='number'
									value={expenseToEdit?.amount || "0"}
									onChange={(e) =>
										setExpenseToEdit((prev) =>
											prev
												? { ...prev, amount: parseFloat(e.target.value) }
												: null
										)
									}
									className='col-span-3'
								/>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<label htmlFor='category' className='text-right'>
									Categoría
								</label>
								<Select
									value={expenseToEdit?.category || ""}
									onValueChange={(value) =>
										setExpenseToEdit((prev) =>
											prev ? { ...prev, category: value } : null
										)
									}
								>
									<SelectTrigger className='col-span-3'>
										<SelectValue placeholder='Categoría' />
									</SelectTrigger>
									<SelectContent>
										{categories?.map((cat, index) => (
											<SelectItem key={index} value={cat.toLowerCase()}>
												{cat}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<label htmlFor='description' className='text-right'>
									Descripción
								</label>
								<Input
									id='description'
									value={expenseToEdit?.description || ""}
									onChange={(e) =>
										setExpenseToEdit((prev) =>
											prev ? { ...prev, description: e.target.value } : null
										)
									}
									className='col-span-3'
								/>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<label htmlFor='supplier' className='text-right'>
									Proveedor
								</label>
								<Input
									id='supplier'
									value={expenseToEdit?.supplier || ""}
									onChange={(e) =>
										setExpenseToEdit((prev) =>
											prev ? { ...prev, supplier: e.target.value } : null
										)
									}
									className='col-span-3'
								/>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<label htmlFor='paid' className='text-right'>
									Pagado
								</label>
								<Checkbox
									id='paid'
									checked={expenseToEdit?.paid || false}
									onCheckedChange={(checked) =>
										setExpenseToEdit((prev) =>
											prev ? { ...prev, paid: checked as boolean } : null
										)
									}
								/>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<label htmlFor='images' className='text-right'>
									Imágenes
								</label>
								<div className='col-span-3'>
									<Input
										id='images'
										type='file'
										accept='image/*'
										multiple
										onChange={handleImageUpload}
									/>
									<div className='flex flex-wrap gap-2 mt-2'>
										{expenseToEdit?.images?.map((image, index) => (
											<div key={index} className='relative'>
												<img
													src={image}
													alt={`Imagen ${index + 1}`}
													className='w-20 h-20 object-cover rounded'
												/>
												<button
													type='button'
													onClick={() => removeImage(index)}
													className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'
												>
													<X size={16} />
												</button>
											</div>
										))}
										{newImages?.map((image, index) => (
											<div key={`new-${index}`} className='relative'>
												<img
													src={URL.createObjectURL(image)}
													alt={`Nueva imagen ${index + 1}`}
													className='w-20 h-20 object-cover rounded'
												/>
												<button
													type='button'
													onClick={() => removeNewImage(index)}
													className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'
												>
													<X size={16} />
												</button>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
						<DialogFooter>
							<Button type='submit' disabled={isEditing}>
								{isEditing ? "Editando..." : "Guardar cambios"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
