
const raddCommas = /\B(?=(\d{3})+(?!\d))/g;
// eslint-disable-next-line import/prefer-default-export
export function addCommas(number: string): string {
  const [wholeNumber, fraction] = number.split('.');
  const formattedNumber = (wholeNumber.length > 3) ? wholeNumber.replace(raddCommas, ',') : wholeNumber;
  return ([formattedNumber, fraction].join('.'));
}
