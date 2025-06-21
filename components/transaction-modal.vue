<template>
    <UModal title="Add Transaction">
        <UButton icon="i-heroicons-plus-circle" color="neutral" variant="outline" label="Add" class="p-2.5" />

        <template #body>
            <UForm :state="state" :schema="schema">
                <UCard>
                    <UFormField label="Transaction Type" name="type" class="mb-4" required>
                        <USelect placeholder="Select the transaction type" :items="types" class="w-full"
                            v-model="state.type" />
                    </UFormField>
                    <UFormField label="Amount" name="amount" class="mb-4" required>
                        <UInput type="number" placeholder="Amount" class="w-full" v-model="state.amount" />
                    </UFormField>
                    <UFormField label="Transaction date" name="created_at" class="mb-4" required>
                        <UInput type="date" icon="i-heroicons-calendar-days-20-solid" class="w-full"
                            v-model="state.created_at" />
                    </UFormField>
                    <UFormField label="Description" hint="Optional" name="description" class="mb-4">
                        <UInput placeholder="Description" class="w-full" v-model="state.description" />
                    </UFormField>
                    <UFormField label="Category" name="category" class="mb-4" required>
                        <USelect placeholder="Category" :items="categories" class="w-full" v-model="state.category" />
                    </UFormField>

                    <UButton type="submit" color="primary" variant="solid" label="Save" />
                </UCard>
            </UForm>
        </template>
    </UModal>
</template>

<script setup>
import { categories, types } from "~/constants";
import z from "zod";

const schema = z.object({
    // type: z.enum(types),
    amount: z.number().positive().min(0),
    created_at: z.string(),
    description: z.string().max(100).optional(),
    // category: z.enum(categories),
})

const state = ref({
    type: undefined,
    amount: 0,
    created_at: undefined,
    description: undefined,
    category: undefined,
})
</script>