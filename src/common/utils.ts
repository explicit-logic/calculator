
const raddCommas = /\B(?=(\d{3})+(?!\d))/g;
export function addCommas(number: string): string {
  const [wholeNumber, fraction] = number.split('.'),
    formattedNumber = (wholeNumber.length > 3) ? wholeNumber.replace(raddCommas, ',') : wholeNumber;
  return ([formattedNumber, fraction].join('.'));
}
