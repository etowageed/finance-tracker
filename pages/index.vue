<template>
    <!-- Header section with page title and view selector -->
    <section class="flex items-center justify-between mb-10">
        <h1 class="text-4xl font-extrabold">
            Summary
        </h1>
        <div>
            <USelect :items="transactionViewOptions" v-model="selectedView" class="w-48" />
        </div>
    </section>

    <!-- Summary cards showing trends for Income, Expense, Investments, etc. -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
        <Trend color="green" title="Income" :amount="incomeTotal" :last-amount="3000" :loading="isLoading" />
        <Trend color="red" title="Expense" :amount="expenseTotal" :last-amount="6000" :loading="isLoading" />
        <Trend color="green" title="Investments" :amount="4000" :last-amount="3000" :loading="isLoading" />
        <Trend color="red" title="Income" :amount="4000" :last-amount="3000" :loading="isLoading" />
    </section>

    <section class="flex justify-between mb-10">
        <div>
            <h2 class="text-2xl font-extrabold">Transactions</h2>
            <div class="text-gray-500 dark:text-gray-400">
                You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this period
            </div>
        </div>


        <div>
            <TransactionModal />
        </div>

    </section>


    <!-- List of transactions rendered using the Transaction component -->
    <section v-if="!isLoading">
        <div v-for="(transactionsOnDay, date) in transactionsGroupedByDate" :key="date" class="mb-10">
            <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
            <Transaction v-for="transaction in transactionsOnDay" :key="transaction.id" :transaction="transaction"
                @refresh="refreshTransactions" />
        </div>
    </section>
    <section v-else>
        <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
</template>

<script setup>
import { transactionViewOptions } from '~/constants';
const selectedView = ref(transactionViewOptions[1])

const transactions = ref([]) // Reactive variable to hold transactions data from the backend

const supabase = useSupabaseClient() // connect to Supabase backend for database operations
const isLoading = ref(false) // Reactive variable to track loading state
const isOpen = ref(false)

// Computed properties for income and expense transactions
const income = computed(() => {
    return transactions.value.filter(t => t.type === 'income')
})
const expense = computed(() => {
    return transactions.value.filter(t => t.type === 'expense')
})
const incomeCount = computed(() => income.value.length)
const expenseCount = computed(() => expense.value.length)
const incomeTotal = computed(() => income.value.reduce((sum, transaction) => sum + transaction.amount, 0))
const expenseTotal = computed(() => expense.value.reduce((sum, transaction) => sum + transaction.amount, 0))


const fetchTransactions = async () => {
    isLoading.value = true

    try {
        const { data } = await useAsyncData('transactions', async () => {
            const { data, error } = await supabase
                .from('transactions')
                .select()
            if (error) return []
            return data
        })

        return data.value
    } finally {
        isLoading.value = false
    }
}

const refreshTransactions = async () => transactions.value = await fetchTransactions()

// Log fetched data to the console for debugging
// console.log(transactions.value);

await refreshTransactions();

//  Group transactions by date for easier display

const transactionsGroupedByDate = computed(() => {
    let grouped = {}

    for (const transaction of transactions.value) {
        const date = new Date(transaction.created_at).toISOString().split('T')[0]

        if (!grouped[date]) {
            grouped[date] = []
        }

        grouped[date].push(transaction)
    }

    return grouped
})

console.log(transactionsGroupedByDate.value)

</script>