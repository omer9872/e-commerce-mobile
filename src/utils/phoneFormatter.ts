const format = (phone?: string | null) => {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  const match = digits.match(/^(\+?90|0)?(\d{3})(\d{3})(\d{4})$/);
  if (!match) return phone;
  const [, , areaCode, firstPart, secondPart] = match;
  return `+90 (${areaCode}) ${firstPart} ${secondPart}`;
};

const phoneFormatter = {
  format: format,
};

export default phoneFormatter;
