"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import useSWR from "swr";
import { Task } from "@/types";
import { fetcher } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "./ui/skeleton";

export default function TaskList() {
	const { data: tasks, isLoading } = useSWR<Task[]>("/api/tasks", fetcher);

	// const toggleTask = (id: number) => {
	//   setTasks(tasks.map(task =>
	//     task.id === id ? { ...task, completed: !task.completed } : task
	//   ))
	// }

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Tareas Pendientes</CardTitle>
				</CardHeader>
				<CardContent>
					<Skeleton className='h-8 w-[120px]' />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='animate-fade-in'>
			<CardHeader>
				<CardTitle>Tareas Pendientes</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
					{tasks?.map((task) => (
						<div
							key={task.id}
							className='flex items-center space-x-2 border-b pb-2'
						>
							<Checkbox
								id={`task-${task.id}`}
								checked={task.progress === 100}
								// onCheckedChange={() => toggleTask(task.id)}
							/>
							<label
								htmlFor={`task-${task.id}`}
								className={`text-xs ${
									task.status === "Finalizada" || task.status === "Cancelada"
										? "line-through"
										: ""
								}
									  ${task.isAdditional ? "text-blue-600" : "text-gray-500"}

								  }`}
							>
								{task.name}
								{task.isAdditional && (
									<Badge variant='outline' className='ml-2 text-xs text-blue-600'>
										Adicional
									</Badge>
								)}
							</label>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
