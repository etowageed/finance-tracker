// composable to fromat any amount to currency format

export const useCurrency = (amount) => {
  const currency = computed(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "GBP",
    }).format(isRef(amount) ? amount.value : amount);
  });

  return {
    currency,
  };
};
