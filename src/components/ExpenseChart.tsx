"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip,
	Sector,
	TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Expense } from "@/types";
import { fetcher, generateColors } from "@/lib/utils";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-google-charts"), { ssr: false });

interface ExpenseData {
	category: string;
	amount: number;
}

// const COLORS = [
// 	"#0088FE",
// 	"#00C49F",
// 	"#FFBB28",
// 	"#FF8042",
// 	"#8884d8",
// 	"#82ca9d",
// 	"#ffc658",
// 	"#ff7300",
// 	"#a4de6c",
// 	"#d0ed57",
// 	"#83a6ed",
// 	"#8dd1e1",
// ];

const COLORS = generateColors(20);
export default function ExpenseChart() {
	const {
		data: expenses,
		error,
		isLoading,
	} = useSWR<Expense[]>("/api/expenses", fetcher);
	const [chartData, setChartData] = useState<ExpenseData[]>([]);
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		if (expenses) {
			// Agrupar montos por categoría
			const groupedData = expenses.reduce((acc, expense) => {
				const category = expense.category;
				const amount = expense.amount;

				if (!acc[category]) {
					acc[category] = 0;
				}
				acc[category] += amount;

				return acc;
			}, {} as Record<string, number>);

			// Convertir el objeto agrupado a un array para el gráfico
			const formattedData = Object.entries(groupedData).map(
				([category, amount]) => ({
					category,
					amount,
				})
			);

			setChartData(formattedData);
		}
	}, [expenses]);

	const onPieEnter = (_: any, index: number) => {
		setActiveIndex(index);
	};

	const renderActiveShape = (props: any) => {
		const RADIAN = Math.PI / 180;
		const {
			cx,
			cy,
			midAngle,
			innerRadius,
			outerRadius,
			startAngle,
			endAngle,
			fill,
			payload,
			percent,
			value,
		} = props;
		const sin = Math.sin(-RADIAN * midAngle);
		const cos = Math.cos(-RADIAN * midAngle);
		const sx = cx + (outerRadius + 10) * cos;
		const sy = cy + (outerRadius + 10) * sin;
		const mx = cx + (outerRadius + 30) * cos;
		const my = cy + (outerRadius + 30) * sin;
		const ex = mx + (cos >= 0 ? 1 : -1) * 22;
		const ey = my;
		const textAnchor = cos >= 0 ? "start" : "end";

		return (
			<g>
				<text x={cx} y={cy} dy={8} textAnchor='middle' fill={fill}>
					{payload.category}
				</text>
				<Sector
					cx={cx}
					cy={cy}
					innerRadius={innerRadius}
					outerRadius={outerRadius}
					startAngle={startAngle}
					endAngle={endAngle}
					fill={fill}
				/>
				<Sector
					cx={cx}
					cy={cy}
					startAngle={startAngle}
					endAngle={endAngle}
					innerRadius={outerRadius + 6}
					outerRadius={outerRadius + 10}
					fill={fill}
				/>
				<path
					d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
					stroke={fill}
					fill='none'
				/>
				<circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
				<text
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					textAnchor={textAnchor}
					fill='#333'
				>{`$${value.toLocaleString()}`}</text>
				<text
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					dy={18}
					textAnchor={textAnchor}
					fill='#999'
				>
					{`(${(percent * 100).toFixed(2)}%)`}
				</text>
			</g>
		);
	};

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Distribución de Gastos</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='w-full h-[400px] flex items-center justify-center'>
						<Skeleton className='h-[300px] w-[300px] rounded-full' />
					</div>
				</CardContent>
			</Card>
		);
	}
	if (error) return <div>Error al cargar los datos</div>;

	const googleChartData = [
		["Categoría", "Monto"], // Header
		...chartData.map((item) => [item.category, item.amount]),
	];

	const chartOptions = {
		// title: "Distribución de Gastos",
		pieHole: 0.4, // Hacerlo un gráfico de dona (opcional)
		// pieSliceText: "none", // Mostrar solo tooltips
		// tooltip: { text: "value" }, // Mostrar valor en el tooltip
		legend: { position: "bottom" },
		chartArea: { width: "90%", height: "75%" },
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>Distribución de Gastos</CardTitle>
			</CardHeader>
			<CardContent>
				{/* <div className='w-full h-[200px] sm:h-[360px] md:h-[400px] lg:h-[440px]'>
					<ResponsiveContainer width='100%' height='100%'>
						<PieChart>
							<Pie
								activeIndex={activeIndex}
								activeShape={renderActiveShape}
								data={chartData}
								cx='50%'
								cy='50%'
								innerRadius='60%'
								outerRadius='80%'
								fill='#8884d8'
								dataKey='amount'
								onMouseEnter={onPieEnter}
							>
								{chartData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip
								formatter={(value: number) => `$${value.toLocaleString()}`}
								labelFormatter={(_, payload) =>
									payload[0]?.payload.category || ""
								}
							/>
						</PieChart>
					</ResponsiveContainer>
				</div> */}
				<div className='w-full h-[400px] md:h-[440px] lg:h-[480px]'>
					<Chart
						chartType='PieChart'
						width='100%'
						height='100%'
						data={googleChartData}
						options={chartOptions}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
