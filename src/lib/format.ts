export const formatPrice = (price: number) =>
  `S/. ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;