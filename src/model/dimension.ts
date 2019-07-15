/**
 * @author Thomas Kleinke
 */
export interface Dimension {

    // Normalized values (in micrometres), calculated from input values
    value?: number;
    rangeMin?: number;
    rangeMax?: number;

    // Input values as typed in by the user (in mm/cm/m, defined in inputUnit)
    inputValue: number;
    inputRangeEndValue: number;
    inputUnit: 'mm'|'cm'|'m';

    measurementPosition?: string;
    measurementComment?: string;
    isImprecise: boolean;
    isRange: boolean;

    label?: string; // Deprecated
}