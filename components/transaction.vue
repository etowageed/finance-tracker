<template>
    <div class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-1">
                <UIcon :name="icon" :class="iconColor" />
                <div>{{ transaction.description }}</div>
            </div>
            <div>
                <UBadge color="neutral" variant="outline" v-if="transaction.category">{{ transaction.category }}
                </UBadge>
            </div>
        </div>
        <div class="flex items-center justify-end space-x-2">
            <div>{{ currency }}</div>
            <div>
                <UDropdownMenu :items="items" :popper="{ placement: 'bottom-start' }">
                    <UButton color="neutral" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal"
                        :loading="isLoading" />
                </UDropdownMenu>
            </div>
        </div>
    </div>
</template>

<script setup>
// import { select } from '#build/ui';

const props = defineProps({
    transaction: Object,

})

const emit = defineEmits(['refresh'])

//  make the icon dynamic based on the transaction type
const icon = computed(() => {
    return props.transaction.type === 'income'
        ? 'i-heroicons-arrow-up-right'
        : 'i-heroicons-arrow-down-left';
})
// make the icon color dynamic based on the transaction type
const iconColor = computed(() => {
    return props.transaction.type === 'income' ? 'text-green-600' : 'text-red-600';
})

const { currency } = useCurrency(props.transaction.amount)
const isLoading = ref(false)

// toast notification
const toast = useToast()

const supabase = useSupabaseClient()

const deleteTransaction = async () => {
    isLoading.value = true
    try {
        // Call the Supabase delete function to remove the transaction
        await supabase
            .from('transactions')
            .delete()
            .eq('id', props.transaction.id)
        toast.add({
            title: 'Transaction deleted',
            icon: 'i-heroicons-check-circle',
            color: 'success',
        })
        // Emit an event to notify the parent component to refresh the transaction list
        emit('refresh', props.transaction.id)
    } catch (error) {
        console.error('Error deleting transaction:', error)
        toast.add({
            title: 'Error deleting transaction',
            message: error.message,
            icon: 'i-heroicons-x-circle',
            color: 'danger',
        })
    } finally {
        isLoading.value = false
    }

}

const items = [
    [
        {
            label: 'Edit',
            icon: 'i-heroicons-pencil-square-20-solid',
            onSelect: () => console.log('Edit action triggered')
        },
        {
            label: 'Delete',
            icon: 'i-heroicons-trash-20-solid',
            onSelect: deleteTransaction
        }
    ]
]


</script>