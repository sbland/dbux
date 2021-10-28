import filterTypes from '../FilterTypes';
import { switchF, tryF } from './functionalProgramming';

/**
 * Format a number with decimal place
 * @param {number} v The number to format
 * @param {number} step decimal number to limit decimal places
 * @returns number
 */
export const formatValue = (v, step = 0.01, strict) => {
  const [whole] = v.toFixed(100).split('.');
  if (!Number(v) && !strict) return 0;
  // match accuracy of step size
  if (step === 1) {
    return parseFloat(whole);
  }
  if (Math.floor(step) === step) {
    // Has no decimal places
    const accuracy = step.toString().length;
    const vLength = whole.length;
    if (vLength >= step.toString().length) return Math.round(whole / step) * step;
    const vSuff = v
      .toString()
      .split('.')[0]
      .slice(0, vLength - accuracy + 1);
    return parseFloat(vSuff) * 10 ** (accuracy - vSuff.length + 1);
  }
  // Has decimal places
  const accuracy = step.toString().split('.')[1].length;
  return parseFloat(v.toFixed(accuracy));
};

/**
 * Validate and sanitize a number value
 * @param {number} vIn value to validate
 * @param {number} min minium allowed value
 * @param {number} max max allowed value
 * @param {number} step decimal number identifying number of decimal places
 * @param {number} defaultValue The default value to use if is invalid
 * @returns number
 */
export const validateValue = (vIn, min, max, step, defaultValue) => {
  if (vIn == null) return defaultValue || '';
  const v = Number(vIn);
  if (v < min) return min;
  if (v > max) return max;
  const newVal = formatValue(v, step, true);
  if (Number.isNaN(newVal)) return '';
  return newVal;
};

/**
 *
 * @param {object} data data with default values and type
 * @returns
 */
export const getDefaultValue = (data) => {
  if (data.defaultValue !== undefined) return data.defaultValue;
  if (data.type === filterTypes.number) return 0;
  if (data.type === filterTypes.bool) return false;
  if (data.type === filterTypes.toggle) return false;
  return '';
};

export const sanitizeNumber = (cellData, columnData = {}) =>
  !Number.isNaN(Number(cellData)) ? formatValue(Number(cellData), columnData.step) : 'Invalid';

export const sanitizeCellData = (cellData, columnData = {}) =>
  switchF(
    typeof cellData,
    {
      // TODO: textLong
      object: () =>
        cellData !== null ? cellData.label || cellData.name : getDefaultValue(columnData),
      number: () => sanitizeNumber(cellData, columnData),
      string: () =>
        columnData.type === filterTypes.number ? sanitizeNumber(cellData, columnData) : cellData,
      undefined: () => (columnData.type === filterTypes.number ? 0 : ''),
    },
    () => cellData
  );

export const stringifyNumber = (data, metaData) => {
  const { step, commas } = metaData;
  if (data === null || data === undefined) return '';
  const dataParsed = Number(data);
  if (Number.isNaN(dataParsed)) return 'Invalid';
  const [whole, point] = `${formatValue(dataParsed, step)}`.split('.');
  if (!step) return point !== undefined ? `${whole}.${point}` : whole;
  if (step >= 1.0) return whole;
  const pointLength = step.toString().split('.')[1].length;
  const formattedPoint = `${point || 0}000000000`.slice(0, pointLength);
  if (!formattedPoint) return whole;
  if (commas) {
    // TODO: Need to reverse
    const wholeCommas = whole
      .split('')
      .reverse()
      .join('')
      .match(/.{1,3}/g)
      .map((v) => v.split('').reverse().join(''))
      .reverse()
      .join(',');
    return `${wholeCommas}.${formattedPoint}`;
  }
  return `${whole}.${formattedPoint}`;
};

export const stringifyText = (data, _metaData) => (data === null || data === undefined ? '' : data);
export const stringifyBool = (data, _metaData) => (data ? 'Yes' : 'No');
export const stringifyDict = (data, metaData) => {
  if (!data) return '';
  if (metaData.labelField) return data[metaData.labelField] || '';
  return data.label || data.name || 'Invalid Object';
};

export const stringifyDate = (data, _metaData) =>
  tryF(
    () => {
      const a = new Date(data);
      return a.toLocaleString();
    },
    () => 'Invalid Date'
  );

/* Individual components should override image parsing if they need to display the image */
export const stringifyImage = (data, _metaData) => data;

/**
 * Parse an item using meta data and type based parser
 *
 * Meta data contents:
 * - type
 * - step
 *
 * Parser signature
 * (data, metaData) => parsedValue
 *
 * @param {any} item the data to parse
 * @param {object} metaData column data to parse to
 * @param {objectOf} customParsers dict containing custom parsers
 * @returns parsed item
 */
export const stringifyData = (item, metaData, customParsers) => {
  const parser = switchF(
    metaData.type,
    {
      text: () => stringifyText,
      textLong: () => stringifyText,
      button: () => stringifyText,
      select: () => stringifyText, // TODO: Should this use label instead of just data?
      link: () => stringifyText,
      number: () => stringifyNumber,
      bool: () => stringifyBool,
      toggle: () => stringifyBool,
      dict: () => stringifyDict,
      date: () => stringifyDate,
      image: () => stringifyImage,
      reference: () => stringifyDict,
      /* Note: Custom parsers override the above defaults */
      ...Object.entries(customParsers).reduce((acc, [key, customParser]) => {
        acc[key] = () => customParser;
        return acc;
      }, {}),
    },
    () => {
      throw Error(`Missing parser for ${metaData.uid} of type ${metaData.type}`);
    }
  );

  const itemType = typeof item;

  if (itemType === 'object' && Array.isArray(item)) {
    return item
      .slice(0, 5)
      .map((subItem) => stringifyData(subItem, metaData, customParsers))
      .flat()
      .join(', ');
  }
  return parser(item, metaData);

  // if (['string', 'number'].indexOf(itemType) !== -1) return item;
  // if (itemType === 'boolean') return item ? 'Yes' : 'No';
  // if (itemType === 'object' && Array.isArray(item) && item.length === 0) return ' - ';
  // if (itemType === 'object' && Array.isArray(item) && typeof item[0] === 'string')
  //   return item.slice(0, 5).join(', ');
  // if (itemType === 'object' && Array.isArray(item) && typeof item[0] === 'object' && item[0].name)
  //   return item
  //     .slice(0, 5)
  //     .map((i) => i.name)
  //     .join(', ');
  // if (itemType === 'object' && Array.isArray(item) && typeof item[0] === 'object' && item[0].uid)
  //   return item
  //     .slice(0, 5)
  //     .map((i) => i.uid)
  //     .join(', ');
  // if (itemType === 'object') return JSON.stringify(item);
  // return item;
  // // throw Error('Invalid item type');
};
