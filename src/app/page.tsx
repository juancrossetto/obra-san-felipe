import ExpenseSummary from "@/components/ExpenseSummary";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import ExpenseChart from "@/components/ExpenseChart";
import GanttChart from "@/components/GanttChart";
import DollarExchange from "@/components/DollarExchange";
import SupplierDebts from "@/components/SupplierDebts";
import InstallmentPayments from "@/components/InstallmentPayments";

export default async function Home() {
	console.log(
		"process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'):",
		process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")
	);
	console.log(
		"process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL:",
		process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
	);
	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-4xl font-bold mb-8'>
				Control de Gastos de Remodelación
			</h1>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
				<ExpenseSummary />
				<DollarExchange />
				<SupplierDebts />
			</div>
			<div className='grid grid-cols-1 md:grid-cols-5 gap-8 mb-8'>
				<div className='md:col-span-2'>
					<ExpenseForm />
				</div>
				<div className='md:col-span-3'>
					<ExpenseChart />
				</div>
			</div>
			<div className='mb-8'>
				<ExpenseList />
			</div>
			<div>
				<GanttChart />
			</div>
			<div className='mb-8'>
				<InstallmentPayments />
			</div>
		</div>
	);
}
