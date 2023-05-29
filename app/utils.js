import Decimal from 'decimal.js';

export const toDecimal = (value) => new Decimal(value.replace(/\,/g, ''))
