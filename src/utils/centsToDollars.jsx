export function centsToDollars(cents) {
  const dollars = Math.floor(cents / 100);
  const centsRemainder = cents % 100;
  return centsRemainder.toString().padStart(2, "0");
}