/**
 * Handelbars helper, реализует оператор ===
 * @param {any} lhs - левая часть выражения
 * @param {any} rhs - правая часть выражения
 * @return {boolean} - результат сравнения
 * @constructor
 */
export default function IsEqualHelper(lhs: any, rhs: any): boolean {
    return parseInt(lhs) === parseInt(rhs);
};
