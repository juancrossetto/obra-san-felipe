/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { DailyWork } from "@/types";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { Skeleton } from "./ui/skeleton";
import moment from "moment";
import { Calendar, XCircle } from "lucide-react";

interface DailyWorksTimelineProps {
	directedBy: string;
}
export default function DailyWorksTimeline({
	directedBy,
}: DailyWorksTimelineProps) {
	const {
		data: works,
		error,
		isLoading,
	} = useSWR<DailyWork[]>("/api/dailyWorks", fetcher);
	const [filteredWorks, setFilteredWorks] = useState<DailyWork[]>([]);
	const [additionalDaysCount, setAdditionalDaysCount] = useState(0);

	useEffect(() => {
		if (works?.length) {
			const worksByDirected = works.filter((w) => w.directedBy === directedBy);
			setFilteredWorks(worksByDirected);
			setAdditionalDaysCount(
				worksByDirected.filter((work) => work.isAdditional).length
			);
		}
	}, [works]);

	if (isLoading) {
		return (
			<Card>
				<CardHeader>Trabajos Diarios</CardHeader>
				<CardContent>
					<Skeleton className='h-[300px] w-full' />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle className='flex justify-between items-center text-lg'>
					<span>Trabajos Diarios {directedBy}</span>
					<Badge variant='secondary'>
						Días adicionales: {additionalDaysCount}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className='h-[600px] pr-4'>
					<div className='relative'>
						<div className='absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200'></div>
						{filteredWorks
							?.sort(
								(a, b) =>
									moment(b.date, "DD/MM/YYYY").valueOf() -
									moment(a.date, "DD/MM/YYYY").valueOf()
							)
							?.map((work, index) => (
								<div
									key={index}
									className={`mb-4 flex text-sm ${
										work.isAdditional ? "bg-yellow-50 p-3 rounded-lg" : ""
									}`}
								>
									<div className='flex-shrink-0 w-4 relative'>
										<div
											className={`w-2 h-2 ${
												work.isAdditional ? "bg-yellow-500" : "bg-blue-500"
											} rounded-full absolute top-1.5 ${
												work.isAdditional ? "right-4" : "left-1"
											}  z-10`}
										></div>
									</div>
									<div className='flex-grow pl-4'>
										<div className='flex items-center mb-1'>
											<h3 className='font-semibold text-sm'>{work.date}</h3>
											{work.day ? (
												<span className='ml-2 px-2 py-0.5 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full flex items-center'>
													<Calendar className='w-3 h-3 mr-1' />
													Día {work.day}
												</span>
											) : (
												<span className='ml-2 px-2 py-0.5 text-xs font-semibold text-gray-600 bg-gray-200 rounded-full flex items-center'>
													<XCircle className='w-3 h-3 mr-1' />
													No trabajado
												</span>
											)}

											{work.isAdditional && (
												<Badge variant='destructive' className='ml-2 text-xs'>
													Día Adicional
												</Badge>
											)}
										</div>
										<p className='text-gray-700 text-sm'>{work.description}</p>
										{work.isAdditional && work.additionalDescription && (
											<p className='mt-1 text-xs text-yellow-600 bg-yellow-100 p-1.5 rounded'>
												<strong>Descripción adicional:</strong>{" "}
												{work.additionalDescription}
											</p>
										)}
									</div>
								</div>
							))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
