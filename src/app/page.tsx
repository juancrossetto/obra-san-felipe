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

export default function Home() {
	return (
		<div className='min-h-screen bg-gray-100'>
			<UnpaidExpenseWarning />
			<div className='container mx-auto px-4 py-8'>
				<h1 className='text-3xl font-bold mb-8 text-gray-800'>
					Dashboard de Control de Obra
				</h1>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
					{/* <div className='lg:col-span-3  flex'>
						<ExpenseSummary />
					</div>
					<div className='lg:col-span-3 flex'>
						<DollarExchange />
					</div>
					<div className='lg:col-span-2 flex'>
						<ProjectProgress />
					</div>
					<div className='lg:col-span-2 flex'>
						<WeatherWidget />
					</div> */}
					<ExpenseSummary />
					<DollarExchange />
					<ProjectProgress />
					<WeatherWidget />
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch'>
					<div className='lg:col-span-2'>
						<ExpenseChart />
					</div>
					<div className='flex'>
						<SupplierDebts />
					</div>
				</div>

				<div className='mb-8'>
					<DailyWorksTimeline />
				</div>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
					<DailyExpenseChart />
					<TaskList />
				</div>

				<div className='mb-8'>
					<GanttChart />
				</div>

				<div className='mb-8'>
					<ExpenseList />
				</div>

				<div className='mb-8'>
					<PaymentsList />
				</div>

				<div className='mb-8'>
					<InstallmentPayments />
				</div>
			</div>
		</div>
	);
}
