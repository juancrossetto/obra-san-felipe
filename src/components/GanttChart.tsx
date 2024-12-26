"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { Task } from "@/types";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const Chart = dynamic(() => import("react-google-charts"), { ssr: false });

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function GanttChart() {
	const { data: tasks, isLoading } = useSWR<Task[]>("/api/tasks", fetcher);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isLoading) {
		return (
			<Card className='w-full'>
				<CardHeader>
					<CardTitle className='flex flex-col sm:flex-row items-start sm:items-center justify-between'>
						<span className='mb-2 sm:mb-0'>
							Cronograma del Proyecto - Lote 310 San Felipe
						</span>
						<div className='flex flex-wrap gap-2'>
							<Skeleton className='h-6 w-20' />
							<Skeleton className='h-6 w-20' />
							<Skeleton className='h-6 w-20' />
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent className='pl-0 pr-0'>
					<div className='h-[400px] sm:h-[600px] md:h-[800px] w-full'>
						<Skeleton className='h-full w-full' />
					</div>
				</CardContent>
			</Card>
		);
	}

	const parseDate = (dateString: string) => {
		const [day, month, year] = dateString.split("/").map(Number);
		return new Date(year, month - 1, day);
	};

	const data = [
		[
			{ type: "string", label: "Task ID" },
			{ type: "string", label: "Task Name" },
			{ type: "string", label: "Resource" },
			{ type: "date", label: "Start Date" },
			{ type: "date", label: "End Date" },
			{ type: "number", label: "Duration" },
			{ type: "number", label: "Percent Complete" },
			{ type: "string", label: "Dependencies" },
		],
		...(tasks || [])?.map((task) => [
			task.id.toString(),
			task.name,
			task.status,
			parseDate(task.startDate),
			parseDate(task.endDate),
			null,
			task.status === "Finalizada" ? 100 : 0,
			null,
		]),
	];

	const options = {
		height: 800,
		gantt: {
			trackHeight: 25,
			barCornerRadius: 4,
			labelStyle: {
				fontName: "Inter",
				fontSize: 12,
			},
			palette: [
				{
					color: "#9CA3AF", // Gris para tareas pendientes
					dark: "#6B7280",
					light: "#D1D5DB",
				},
				{
					color: "#60A5FA", // Celeste para tareas en progreso
					dark: "#3B82F6",
					light: "#93C5FD",
				},
				{
					color: "#34D399", // Verde para tareas completadas
					dark: "#10B981",
					light: "#6EE7B7",
				},
			],
		},
		backgroundColor: "transparent",
	};

	const renderMobileTaskList = () => (
		<div className='space-y-4'>
			{tasks?.map((task) => (
				<div key={task.id} className='bg-white p-4 rounded-lg shadow'>
					<h3 className='font-semibold mb-2'>{task.name}</h3>
					<p className='text-sm mb-1'>Inicio: {task.startDate}</p>
					<p className='text-sm mb-2'>Fin: {task.endDate}</p>
					<Badge
						variant='outline'
						className={
							task.status === "Pendiente"
								? "bg-gray-200 text-gray-800"
								: task.status === "En Proceso"
								? "bg-blue-200 text-blue-800"
								: "bg-green-200 text-green-800"
						}
					>
						{task.status}
					</Badge>
				</div>
			))}
		</div>
	);

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle className='flex flex-col sm:flex-row items-start sm:items-center justify-between'>
					<span className='mb-2 sm:mb-0'>
						Cronograma del Proyecto - Lote 310 San Felipe
					</span>
					<div className='flex flex-wrap gap-2'>
						<Badge variant='outline' className='bg-gray-200 text-gray-800'>
							Pendiente
						</Badge>
						<Badge variant='outline' className='bg-blue-200 text-blue-800'>
							En Progreso
						</Badge>
						<Badge variant='outline' className='bg-green-200 text-green-800'>
							Completado
						</Badge>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{isDesktop ? (
					<Chart
						chartType='Gantt'
						width='100%'
						height='800px'
						data={data}
						options={options}
					/>
				) : (
					renderMobileTaskList()
				)}
			</CardContent>
		</Card>
	);
}
