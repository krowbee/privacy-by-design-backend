export function maskNumbers(passportNumber: string) {
  const length = passportNumber.length;
  const visibleLength = 3;

  const visiblePart = passportNumber.slice(-visibleLength);
  const mask = '*'.repeat(length - visibleLength);

  return mask + visiblePart;
}
