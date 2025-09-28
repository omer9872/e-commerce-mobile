const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',

  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const format = (price?: number) => {
  let formattedPrice: string;
  if (price) {
    formattedPrice = currencyFormatter.format(price === 0 ? 0 : price);
  } else {
    formattedPrice = currencyFormatter.format(0);
  }

  return formattedPrice;
};

const parseFormattedNumber = (numberString?: string): number => {
  let input = numberString ?? '0';
  if (input.includes('.') && input.includes(',')) {
    if (input.indexOf('.') < input.indexOf(',')) {
      input = input.replace(/\./g, '').replace(/,/g, '.');
    } else {
      input = input.replace(/,/g, '');
    }
  } else if (input.includes(',')) {
    input = input.replace(/,/g, '.');
  } else if (input.includes('.')) {
    input = input;
  }

  const parsed = parseFloat(input);

  if (isNaN(parsed)) {
    throw new Error(`Invalid float value: ${input}`);
  }

  return parsed;
};

const formatter = {
  format: format,
  parseFormattedNumber: parseFormattedNumber,
};

export default formatter;
