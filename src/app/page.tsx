import ExpenseSummary from "@/components/ExpenseSummary";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import ExpenseChart from "@/components/ExpenseChart";
import GanttChart from "@/components/GanttChart";
import DollarExchange from "@/components/DollarExchange";
import SupplierDebts from "@/components/SupplierDebts";
import InstallmentPayments from "@/components/InstallmentPayments";
import PaymentsList from "@/components/PaymentsList";
import DailyExpenseChart from "@/components/DailyExpenseChart";

export default async function Home() {
	return (
		<div className='min-h-screen bg-background'>
			<div className='container mx-auto px-4 py-8'>
				<h1 className='text-4xl font-bold mb-8 text-primary'>
					Control de Gastos de Remodelación
				</h1>

				<div className='grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8'>
					<div className='lg:col-span-1 space-y-4'>
						<ExpenseSummary />
						<DollarExchange />
					</div>
					<div className='lg:col-span-3'>
						<SupplierDebts />
					</div>
				</div>

				<div className='mb-8'>
					<ExpenseChart />
				</div>

				<div className='mb-8'>
					<ExpenseList />
				</div>

				<div className='mb-8'>
					<PaymentsList />
				</div>

				<div className='mb-8'>
					<GanttChart />
				</div>

				<div className='mb-8'>
					<DailyExpenseChart />
				</div>

				<div className='mb-8'>
					<InstallmentPayments />
				</div>
			</div>
		</div>
	);
}
