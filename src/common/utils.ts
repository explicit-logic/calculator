
const raddCommas = /\B(?=(\d{3})+(?!\d))/g;

export function addCommas(number: string): string {
  const [wholeNumber, fraction] = number.split('.');
  const formattedNumber = (wholeNumber.length > 3) ? wholeNumber.replace(raddCommas, ',') : wholeNumber;
  return ([formattedNumber, fraction].join('.'));
}

export function hasOwnProperty(object: object, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, property);
}
