"use client";
import { useEffect, useRef } from "react";
import { createSwapy, Swapy } from "swapy";
import ExpenseSummary from "@/components/ExpenseSummary";
import ExpenseList from "@/components/ExpenseList";
import ExpenseChart from "@/components/ExpenseChart";
import GanttChart from "@/components/GanttChart";
import DollarExchange from "@/components/DollarExchange";
import SupplierDebts from "@/components/SupplierDebts";
import InstallmentPayments from "@/components/InstallmentPayments";
import PaymentsList from "@/components/PaymentsList";
import DailyExpenseChart from "@/components/DailyExpenseChart";
import ProjectProgress from "@/components/ProjectProgress";
import WeatherWidget from "@/components/WeatherWidget";
import TaskList from "@/components/TaskList";
import UnpaidExpenseWarning from "@/components/UnpaidExpenseWarning";
import DailyWorksTimeline from "@/components/DailyWorksTimeline";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";

export default function Home() {
	const swapyRef = useRef<Swapy | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (containerRef.current) {
			swapyRef.current = createSwapy(containerRef.current, {});

			swapyRef.current.onBeforeSwap((event) => {
				return true;
			});

			swapyRef.current.onSwapStart((event) => {
				console.log("start", event);
			});
			swapyRef.current.onSwap((event) => {
				console.log("swap", event);
			});
			swapyRef.current.onSwapEnd((event) => {
				console.log("end", event);
			});
		}
		return () => {
			swapyRef.current?.destroy();
		};
	}, []);

	return (
		<div className='min-h-screen bg-gray-100'>
			<UnpaidExpenseWarning />
			<div className='container mx-auto px-4 py-8' ref={containerRef}>
				<h1 className='text-3xl font-bold mb-8 text-gray-800'>
					Dashboard de Control de Obra
				</h1>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
					<div className='slot top' data-swapy-slot='a'>
						<div className='item item-a' data-swapy-item='a'>
							<ExpenseSummary />
						</div>
					</div>
					<div className='slot middle-left' data-swapy-slot='b'>
						<div className='item item-b' data-swapy-item='b'>
							<DollarExchange />
						</div>
					</div>
					<div className='slot top' data-swapy-slot='c'>
						<div className='item item-c' data-swapy-item='c'>
							<ProjectProgress />
						</div>
					</div>
					<div className='slot top' data-swapy-slot='d'>
						<div className='item item-d' data-swapy-item='d'>
							<WeatherWidget />
						</div>
					</div>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch'>
					<div className='lg:col-span-2'>
						<ExpenseChart />
					</div>
					<div className='flex'>
						<SupplierDebts />
					</div>
				</div>
				<Accordion type='single' className='mb-8' collapsible>
					<AccordionItem value='alexx'>
						<AccordionTrigger className='text-lg font-semibold'>
							Sección Alexx
						</AccordionTrigger>
						<AccordionContent>
							<div className='mb-8'>
								<DailyWorksTimeline directedBy='Alexx' />
							</div>
						</AccordionContent>
						<AccordionContent>
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
								<DailyExpenseChart />
								<TaskList />
							</div>
						</AccordionContent>
						<AccordionContent>
							<div className='mb-8'>
								<GanttChart />
							</div>
						</AccordionContent>
						<AccordionContent>
							<div className='mb-8'>
								<PaymentsList directedBy='Alexx' />
							</div>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='gustavo'>
					<AccordionTrigger className='text-lg font-semibold'>
							Sección Gustavo
						</AccordionTrigger>
						<AccordionContent>
							<div className='mb-8'>
								<DailyWorksTimeline directedBy='Gustavo' />
							</div>
						</AccordionContent>
						<AccordionContent>
							<div className='mb-8'>
								<PaymentsList directedBy='Gustavo' />
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				<div className='mb-8'>
					<ExpenseList />
				</div>

				<div className='mb-8'>
					<InstallmentPayments />
				</div>
			</div>
		</div>
	);
}
