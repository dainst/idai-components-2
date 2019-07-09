/**
 * @author Thomas Kleinke
 */
export interface Dimension {

    value?: number;
    rangeMin?: number;
    rangeMax?: number;
    inputValue: number;
    inputRangeEndValue: number;
    measurementPosition?: string;
    measurementComment?: string;
    inputUnit: 'mm'|'cm'|'m';
    isImprecise: boolean;
    isRange: boolean;
    label?: string; // Deprecated
}