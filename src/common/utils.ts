
const raddCommas = /\B(?=(\d{3})+(?!\d))/g;

export function addCommas(number: string): string {
  const [wholeNumber, fraction] = number.split('.');
  let formattedNumber = (wholeNumber.length > 3)
    ? wholeNumber.replace(raddCommas, ',')
    : wholeNumber;

  if (number.length > wholeNumber.length) {
    formattedNumber += '.';
  }

  if (fraction) {
    formattedNumber += fraction;
  }

  return formattedNumber;
}

export function hasOwnProperty(object: object, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, property);
}
