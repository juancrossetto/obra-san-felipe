"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import useSWR from "swr";
import { Expense } from "@/types";
import { capitalizeText } from "@/lib/utils";
import { X } from "lucide-react";

export default function ExpenseForm() {
	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState("");
	const [customCategory, setCustomCategory] = useState("");
	const [description, setDescription] = useState("");
	const [supplier, setSupplier] = useState("");
	const [paid, setPaid] = useState(false);
	const [images, setImages] = useState<File[]>([]);
	const [isAdding, setIsAdding] = useState(false);
	const [isFormValid, setIsFormValid] = useState(false);
	const [categories, setCategories] = useState<string[]>([]);

	const { data: expenses, mutate } = useSWR("/api/expenses");
	useEffect(() => {
		const isValid =
			amount !== "" &&
			(category !== "" || customCategory !== "") &&
			description !== "" &&
			supplier !== "";
		setIsFormValid(isValid);
	}, [amount, category, customCategory, description, supplier]);

	useEffect(() => {
		if (expenses) {
			const uniqueCategories = Array.from(
				new Set(
					expenses.map((expense: Expense) => capitalizeText(expense.category))
				)
			);
			setCategories(uniqueCategories as string[]);
		}
	}, [expenses]);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setImages((prevImages) => [
				...prevImages,
				...Array.from(e.target.files as FileList),
			]);
		}
	};

	const removeImage = (index: number) => {
		setImages((prevImages) => prevImages.filter((_, i) => i !== index));
	};

	const handleUploadImage = async () => {
		// Subir imágenes a S3 y obtener sus URLs
		const uploadedImages = await Promise.all(
			images.map(async (file) => {
				const formData = new FormData();
				formData.append("file", file);

				const response = await fetch("/api/s3-upload", {
					method: "POST",
					body: formData,
				});

				if (!response.ok) throw new Error("Error uploading image");

				const { fileName } = await response.json();
				const baseUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com`;
				return `${baseUrl}/${fileName}`;
			})
		);
		return uploadedImages;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsAdding(true);
		try {
			const uploadedImages = await handleUploadImage();
			console.log("uploadedImages:", uploadedImages);
			const newExpense = {
				amount: parseFloat(amount.replace(/\./g, "").replace(/,/g, ".")),
				category,
				description,
				supplier,
				paid,
				date: new Date().toISOString().split("T")[0],
				images: uploadedImages,
			};

			const response = await fetch("/api/expenses", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newExpense),
			});

			if (!response.ok) {
				throw new Error("Error adding expense");
			}

			mutate(); // Refrescar los datos desde SWR
			setAmount("");
			setCategory("");
			setCustomCategory("");
			setDescription("");
			setSupplier("");
			setPaid(false);
			setImages([]);
		} catch (error) {
			console.error("Error adding expense:", error);
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Agregar Nuevo Gasto</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<Input
						type='number'
						placeholder='Monto'
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						required
					/>
					<div className='space-y-2'>
						<Select value={category} onValueChange={setCategory} required>
							<SelectTrigger id='category'>
								<SelectValue placeholder='Selecciona o ingresa una categoría' />
							</SelectTrigger>
							{/* <SelectContent>
								{categories.map((cat) => (
									<SelectItem key={cat} value={cat.toLowerCase()}>
										{cat}
									</SelectItem>
								))}
								<SelectItem value='custom'>Otra (personalizada)</SelectItem>
							</SelectContent> */}
							<SelectContent>
								{categories.map((cat, index) => (
									<SelectItem key={index} value={cat.toLowerCase()}>
										{cat}
									</SelectItem>
								))}
								<SelectItem value='custom'>Otra (personalizada)</SelectItem>
							</SelectContent>
						</Select>
						{category === "custom" && (
							<Input
								placeholder='Ingresa una categoría personalizada'
								value={customCategory}
								onChange={(e) => setCustomCategory(e.target.value)}
								required
							/>
						)}
					</div>
					<Input
						placeholder='Descripción'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
					<Input
						placeholder='Proveedor'
						value={supplier}
						onChange={(e) => setSupplier(e.target.value)}
						required
					/>
					<div className='flex items-center space-x-2'>
						<Checkbox
							id='paid'
							checked={paid}
							onCheckedChange={(checked) => setPaid(checked as boolean)}
						/>
						<label htmlFor='paid'>Pagado</label>
					</div>
					<div className='space-y-2'>
						<label htmlFor='images'>Adjuntar imágenes</label>
						<Input
							id='images'
							type='file'
							accept='image/*'
							multiple
							onChange={handleImageUpload}
						/>
						<div className='flex flex-wrap gap-2 mt-2'>
							{images.map((image, index) => (
								<div key={index} className='relative'>
									<img
										src={URL.createObjectURL(image)}
										alt={`Uploaded ${index + 1}`}
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
						</div>
					</div>
					<Button
						type='submit'
						className='w-full'
						disabled={isAdding || !isFormValid}
					>
						{isAdding ? "Guardando..." : "Agregar Gasto"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
