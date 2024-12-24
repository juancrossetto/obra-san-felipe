// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// // import { fetchTasks } from '@/lib/googleSheets'
// import { Task } from "@/types";
// import useSWR from "swr";
// import moment from "moment";
// import { Skeleton } from "./ui/skeleton";
// import { Chart } from "react-google-charts";

// const columns = [
// 	{ type: "string", label: "Task ID" },
// 	{ type: "string", label: "Task Name" },
// 	{ type: "string", label: "Resource" },
// 	{ type: "date", label: "Start Date" },
// 	{ type: "date", label: "End Date" },
// 	{ type: "number", label: "Duration" },
// 	{ type: "number", label: "Percent Complete" },
// 	{ type: "string", label: "Dependencies" },
// ];

// const fetcher = (url: string) => fetch(url).then((res) => res.json());

// export default function GanttChart() {
// 	const {
// 		data: tasks,
// 		error,
// 		mutate,
// 		isLoading,
// 	} = useSWR<Task[]>("/api/tasks", fetcher);
// 	const [isMobile, setIsMobile] = useState(false);

// 	useEffect(() => {
// 		const checkMobile = () => {
// 			setIsMobile(window.innerWidth < 768);
// 		};

// 		checkMobile();
// 		window.addEventListener("resize", checkMobile);
// 		return () => window.removeEventListener("resize", checkMobile);
// 	}, []);

// 	const transformedRows = tasks?.map((task, index) => {
//     return [
//       `task-${index}`, // ID de la tarea
//       task.name, // Nombre de la tarea
//       task.status, // Recurso
//       moment(task.startDate, "DD/MM/YYYY").toDate(), // Fecha de inicio
//       moment(task.endDate, "DD/MM/YYYY").toDate(), // Fecha de fin
//       null, // Duración
//       task.status === "Finalizada" ? 100 : 0, // Porcentaje completado
//       null, // Dependencias
//       // { style: { fill: color } }, // Estilo personalizado para el color
//     ];
//   });

// 	const data = [columns, ...(transformedRows || [])];


//   const options = {
//     height: 800,
//     gantt: {
//       trackHeight: 25,
//       // palette: [
//       //   {
//       //     "color": "#6de6b9",
//       //     "dark": "#a1f0d3",
//       //     "light": "#a1f0d3",
//       //   },
//       //   {
//       //     "color": "#92c5fe",
//       //     "dark": "#b9d9ff",
//       //     "light": "#b9d9ff"
//       //   },
//       //   {
//       //     "color": "#2664eb",
//       //     "dark": "#3a84f5",
//       //     "light": "#3a84f5",
//       //   }
//       // ]
//       palette: [
//         {
//           "color": "#5e97f6",
//           "dark": "#2a56c6",
//           "light": "#c6dafc"
//         },
//         {
//           "color": "#db4437",
//           "dark": "#a52714",
//           "light": "#f4c7c3"
//         },
//         {
//           "color": "#10b982",
//           "dark": "#35d49a",
//           "light": "#35d49a"
//         },
//       ]
//     },
//     fontName: "Arial, Helvetica, sans-serif;",
//   };

// 	if (isLoading) {
// 		return (
// 			<Card className='w-full'>
// 				<CardHeader>
// 					<CardTitle className='flex flex-col sm:flex-row items-start sm:items-center justify-between'>
// 						<span className='mb-2 sm:mb-0'>
// 							Cronograma del Proyecto - Lote 310 San Felipe
// 						</span>
// 						<div className='flex flex-wrap gap-2'>
// 							<Skeleton className='h-6 w-20' />
// 							<Skeleton className='h-6 w-20' />
// 							<Skeleton className='h-6 w-20' />
// 						</div>
// 					</CardTitle>
// 				</CardHeader>
// 				<CardContent className='pl-0 pr-0'>
// 					<div className='h-[400px] sm:h-[600px] md:h-[800px] w-full'>
// 						<Skeleton className='h-full w-full' />
// 					</div>
// 				</CardContent>
// 			</Card>
// 		);
// 	}

// 	return (
// 		<Card className='w-full'>
// 			<CardHeader>
// 				<CardTitle className='flex flex-col sm:flex-row items-start sm:items-center justify-between'>
// 					<span className='mb-2 sm:mb-0'>
// 						Cronograma del Proyecto - Lote 310 San Felipe
// 					</span>
// 					<div className='flex flex-wrap gap-2'>
// 						<Badge variant='outline' className='bg-red-400'>
// 							Pendiente
// 						</Badge>
// 						<Badge variant='outline' className='bg-blue-400'>
// 							En Progreso
// 						</Badge>
// 						<Badge variant='outline' className='bg-emerald-400'>
// 							Finalizada
// 						</Badge>
// 					</div>
// 				</CardTitle>
// 			</CardHeader>
// 			<CardContent className='pl-0 pr-0'>
// 				<Chart
// 					chartType='Gantt'
// 					width='100%'
// 					height='50%'
// 					data={data}
// 					options={options}
// 				/>
// 			</CardContent>
// 		</Card>
// 	);
// }


'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import { Task } from '@/types'

const Chart = dynamic(() => import('react-google-charts'), { ssr: false })

	const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function GanttChart() {

	const {
		data: tasks,
		error,
		mutate,
		isLoading,
	} = useSWR<Task[]>("/api/tasks", fetcher);
  
	if (isLoading) {
	  return (
		<Card className="w-full">
		  <CardHeader>
			<CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
			  <span className="mb-2 sm:mb-0">Cronograma del Proyecto - Lote 310 San Felipe</span>
			  <div className="flex flex-wrap gap-2">
				<Skeleton className="h-6 w-20" />
				<Skeleton className="h-6 w-20" />
				<Skeleton className="h-6 w-20" />
			  </div>
			</CardTitle>
		  </CardHeader>
		  <CardContent className="pl-0 pr-0">
			<div className="h-[400px] sm:h-[600px] md:h-[800px] w-full">
			  <Skeleton className="h-full w-full" />
			</div>
		  </CardContent>
		</Card>
	  )
	}
  
	const parseDate = (dateString: string) => {
	  const [day, month, year] = dateString.split('/').map(Number)
	  return new Date(year, month - 1, day)
	}
  
	const data = [
	  [
		{ type: 'string', label: 'Task ID' },
		{ type: 'string', label: 'Task Name' },
		{ type: 'string', label: 'Resource' },
		{ type: 'date', label: 'Start Date' },
		{ type: 'date', label: 'End Date' },
		{ type: 'number', label: 'Duration' },
		{ type: 'number', label: 'Percent Complete' },
		{ type: 'string', label: 'Dependencies' },
	  ],
	  ...(tasks || [])?.map(task => [
		task.id.toString(),
		task.name,
		task.status,
		parseDate(task.startDate),
		parseDate(task.endDate),
		null,
		task.status === 'Finalizada' ? 100 :  0,
		null
	  ])
	]
  
	const options = {
	  height: 800,
	  gantt: {
		trackHeight: 25,
		barCornerRadius: 4,
		labelStyle: {
		  fontName: 'Inter',
		  fontSize: 12,
		},
		palette: [
		  {
			"color": "#9CA3AF", // Gris para tareas pendientes
			"dark": "#6B7280",
			"light": "#D1D5DB"
		  },
		  {
			"color": "#60A5FA", // Celeste para tareas en progreso
			"dark": "#3B82F6",
			"light": "#93C5FD"
		  },
		  {
			"color": "#34D399", // Verde para tareas completadas
			"dark": "#10B981",
			"light": "#6EE7B7"
		  }
		]
	  },
	  backgroundColor: 'transparent',
	}
  
	return (
	  <Card className="w-full">
		<CardHeader>
		  <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
			<span className="mb-2 sm:mb-0">Cronograma del Proyecto - Lote 310 San Felipe</span>
			<div className="flex flex-wrap gap-2">
			  <Badge variant="outline" className="bg-gray-200 text-gray-800">Pendiente</Badge>
			  <Badge variant="outline" className="bg-blue-200 text-blue-800">En Progreso</Badge>
			  <Badge variant="outline" className="bg-green-200 text-green-800">Completado</Badge>
			</div>
		  </CardTitle>
		</CardHeader>
		<CardContent>
		  <Chart
			chartType="Gantt"
			width="100%"
			height="800px"
			data={data}
			options={options}
		  />
		</CardContent>
	  </Card>
	)
}

