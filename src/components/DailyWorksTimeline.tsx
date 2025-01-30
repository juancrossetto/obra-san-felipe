"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { DailyWork } from "@/types";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { Skeleton } from "./ui/skeleton";

export default function DailyWorksTimeline() {
	const {
		data: works,
		error,
		isLoading,
	} = useSWR<DailyWork[]>("/api/dailyWorks", fetcher);
	const [additionalDaysCount, setAdditionalDaysCount] = useState(0);

	useEffect(() => {
		if (works?.length) {
			setAdditionalDaysCount(works.filter((work) => work.isAdditional).length);
		}
	}, [works]);

	if (isLoading) {
		return (
			<Card>
				<CardHeader>Trabajos Diarios</CardHeader>
				<CardContent><Skeleton className='h-[300px] w-full' /></CardContent>
			</Card>
		);
	}

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle className='flex justify-between items-center'>
					<span>Trabajos Diarios</span>
					<Badge variant='secondary'>
						Días adicionales: {additionalDaysCount}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className='h-[600px] pr-4'>
					<div className='relative'>
						<div className='absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200'></div>
						{works
							?.sort((a, b) => Number(b.day) - Number(a.day))
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
											<h3 className='text-lg font-semibold'>{work.date}</h3>
											<span className='ml-2 px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full'>
												Día {work.day}
											</span>
											{work.isAdditional && (
												<Badge variant='destructive' className='ml-2'>
													Día Adicional
												</Badge>
											)}
										</div>
										<p className='text-gray-700'>{work.description}</p>
										{work.isAdditional && work.additionalDescription && (
											<p className='mt-1 text-sm text-yellow-600 bg-yellow-100 p-1.5 rounded'>
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
