"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fetcher } from "@/lib/utils";
import { Payment, Task } from "@/types";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Skeleton } from "./ui/skeleton";

export default function ProjectProgress() {
	const { data: tasks, isLoading } = useSWR<Task[]>("/api/tasks", fetcher);
	const { data: payments } = useSWR<Payment[]>("/api/payments", fetcher);
	const [workDays, setWorkDays] = useState(0);
	const [paidDays, setPaidDays] = useState(0);
	const targetProgress = tasks
		? tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length
		: 0;

	const [displayedProgress, setDisplayedProgress] = useState(0);

	useEffect(() => {
		let animationFrame: number;

		// Incrementar gradualmente el progreso mostrado
		const animateProgress = () => {
			setDisplayedProgress((prev) => {
				if (prev < targetProgress) {
					return Math.min(prev + 0.2, targetProgress); // Incrementa hasta el valor objetivo
				} else {
					cancelAnimationFrame(animationFrame); // Detén la animación cuando se alcance el objetivo
					return prev;
				}
			});
			animationFrame = requestAnimationFrame(animateProgress);
		};

		animateProgress();

		return () => cancelAnimationFrame(animationFrame); // Limpia la animación al desmontar
	}, [targetProgress]);

	useEffect(() => {
		if (payments?.length) {
			setWorkDays(
				payments.reduce((sum, payment) => sum + (payment.daysWorked ?? 0), 0)
			);
			setPaidDays(
				payments.reduce((sum, payment) => sum + (payment.paydDays ?? 0), 0)
			);
		}
	}, [payments]);

	if (isLoading) {
		return (
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>Progreso del Proyecto</CardTitle>
				</CardHeader>
				<CardContent>
					<Skeleton className='h-6 w-[120px]' />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='animate-fade-in w-full'>
			<CardHeader>
				<CardTitle className='text-sm font-medium'>
					Progreso del Proyecto
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex justify-between items-center mb-2'>
					<div className='text-2xl font-bold'>
						{Math.round(displayedProgress)}%
					</div>
					<div className='text-sm text-muted-foreground'>
						<div>Días trabajados: {workDays}</div>
						<div>Días pagados: {paidDays}</div>
					</div>
				</div>
				<Progress value={displayedProgress} className='mt-2' />
				<p className='text-xs text-muted-foreground mt-2'>
					{displayedProgress < 100 ? "En progreso" : "Completado"}
				</p>
			</CardContent>
		</Card>
	);
}
