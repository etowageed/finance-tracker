<template>
    <UModal v-model="isOpen" title="Add Transaction">
        <UButton icon="i-heroicons-plus-circle" color="neutral" variant="outline" label="Add" class="p-2.5" />

        <template #body>
            <UForm :state="state" :schema="schema" ref="form" @submit="save">
                <UCard>
                    <UFormField label="Transaction Type" name="type" class="mb-4" required>
                        <USelect placeholder="Select the transaction type" :items="types" class="w-full"
                            v-model="state.type" />
                    </UFormField>
                    <UFormField label="Amount" name="amount" class="mb-4" required>
                        <UInput type="number" placeholder="Amount" class="w-full" v-model.number="state.amount" />
                    </UFormField>
                    <UFormField label="Transaction date" name="created_at" class="mb-4" required>
                        <UInput type="date" icon="i-heroicons-calendar-days-20-solid" class="w-full"
                            v-model="state.created_at" />
                    </UFormField>
                    <UFormField label="Description" hint="Optional" name="description" class="mb-4">
                        <UInput placeholder="Description" class="w-full" v-model="state.description" />
                    </UFormField>
                    <!-- Category field is only shown for expenses -->
                    <UFormField label="Category" name="category" class="mb-4" v-if="state.type === 'Expense'" required>
                        <USelect placeholder="Category" :items="categories" class="w-full" v-model="state.category" />
                    </UFormField>

                    <UButton type="submit" color="primary" variant="solid" label="Save" :loading="isLoading" />
                </UCard>
            </UForm>
        </template>
    </UModal>
</template>

<script setup>
import { categories, types } from "~/constants";
import z from "zod";

const props = defineProps({
    modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'saved']) // Emit an event when the transaction is saved

const defaultSchema = z.object({
    // type: z.enum(types),
    amount: z.number().positive().min(0),
    created_at: z.string(),
    description: z.string().max(100).optional(),
    // category: z.enum(categories),
})

const incomeSchema = z.object({
    type: z.literal('income')
})
const expenseSchema = z.object({
    type: z.literal('expense'),
    category: z.enum(categories)

})
const investmentSchema = z.object({
    type: z.literal('investment')
})
const savingSchema = z.object({
    type: z.literal('saving')
})
// Add custom errorMap to the discriminatedUnion
const schema = z.intersection(
    z.discriminatedUnion('type', [incomeSchema, expenseSchema, investmentSchema, savingSchema], {
        errorMap: (issue, ctx) => {
            if (issue.code === 'invalid_union_discriminator') {
                return { message: "Please select a valid transaction type: income, expense, investment, or saving." }
            }
            return { message: ctx.defaultError }
        }
    }),
    defaultSchema
)

const form = ref()
const isLoading = ref(false)
const supabase = useSupabaseClient() // connect to Supabase backend for database operations
const toast = useToast() // toast notification

const initialState = {
    type: undefined,
    amount: 0,
    created_at: undefined,
    description: undefined,
    category: undefined,
}

const save = async () => {
    if (form.value.errors.length) return
    isLoading.value = true
    try {
        const { error } = await supabase.from('transactions')
            .upsert({ ...state.value })
        if (!error) {
            toast.add({
                'title': 'Transaction saved',
                'icon': 'i-heroicons-check-circle',
                'color': 'success',
            })
            isOpen.value = false
            emit('saved')
            return
        }
        throw error
    } catch (e) {
        toast.add({
            title: 'Transaction not saved',
            description: e.message,
            icon: 'i-heroicons-x-circle',
            color: 'error',
        })
    } finally {
        isLoading.value = false
    }

}

const state = ref({
    ...initialState
})

const resetForm = () => {
    Object.assign(state.value, initialState)
    form.value.clear()
}

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => {
        if (!value) resetForm()
        emit('update:modelValue', value)
    }
})
</script>