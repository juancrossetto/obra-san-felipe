"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fetcher } from "@/lib/utils";
import { Task } from "@/types";
import useSWR from "swr";

export default function ProjectProgress() {
	const { data: tasks, isLoading } = useSWR<Task[]>("/api/tasks", fetcher);
	const progress = tasks
		? tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length
		: 0;

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-sm font-medium'>
					Progreso del Proyecto
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>{progress}%</div>
				<Progress value={progress} className='mt-2' />
				<p className='text-xs text-muted-foreground mt-2'>
					{progress < 100 ? "En progreso" : "Completado"}
				</p>
			</CardContent>
		</Card>
	);
}
