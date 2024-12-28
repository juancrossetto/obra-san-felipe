"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fetcher } from "@/lib/utils";
import { Task } from "@/types";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Skeleton } from "./ui/skeleton";

export default function ProjectProgress() {
	const { data: tasks, isLoading } = useSWR<Task[]>("/api/tasks", fetcher);
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
				<div className='text-2xl font-bold'>
					{Math.round(displayedProgress)}%
				</div>
				<Progress value={displayedProgress} className='mt-2' />
				<p className='text-xs text-muted-foreground mt-2'>
					{displayedProgress < 100 ? "En progreso" : "Completado"}
				</p>
			</CardContent>
		</Card>
	);
}
