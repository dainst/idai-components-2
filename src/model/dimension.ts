import {flow, dissoc, isNumber} from 'tsfun';

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
    inputRangeEndValue?: number;
    inputUnit: 'mm'|'cm'|'m';

    measurementPosition?: string;
    measurementComment?: string;
    isImprecise: boolean;

    label?: string; // Deprecated
}


/**
 * @author Fabian Z.
 * @author Thomas Kleinke
 */
export module Dimension {

    export const VALUE = 'value';
    export const LABEL = 'label';
    export const RANGE = 'range';
    export const RANGEMIN = 'rangeMin';
    export const RANGEMAX = 'rangeMax';
    export const INPUTVALUE = 'inputValue';
    export const INPUTRANGEENDVALUE = 'inputRangeEndValue';
    export const INPUTUNIT = 'inputUnit';
    export const MEASUREMENTPOSITION = 'measurementPosition';
    export const MEASUREMENTCOMMENT = 'measurementComment';
    export const ISIMPRECISE = 'isImprecise';

    const VALID_FIELDS = [VALUE, LABEL, RANGE, RANGEMIN, RANGEMAX,
        INPUTVALUE, INPUTRANGEENDVALUE, INPUTUNIT, MEASUREMENTPOSITION, MEASUREMENTCOMMENT, ISIMPRECISE];

    const VALID_INPUT_UNITS = ['mm', 'cm', 'm'];


    /**
     * Note: There still may be dimension['isRange'] boolean values stored in the database.
     * These should be handled properly if we're up to changing things here, for example if
     * we want to make sure only defined fields are present.
     *
     * @param dimension
     * @param options
     */
    export function isValid(dimension: Dimension, options?: any): boolean {

        for (const fieldName in dimension) {
            if (!VALID_FIELDS.includes(fieldName)) return false;
        }

        if (dimension.label) return true;
        if (!dimension.inputValue || !dimension.inputUnit) return false;
        if (!VALID_INPUT_UNITS.includes(dimension.inputUnit)) return false;

        if (!isNumber(dimension.inputValue)) return false;

        if (dimension.inputRangeEndValue !== undefined) {

            if (!isNumber(dimension.inputRangeEndValue)) return false;
            if (dimension.inputRangeEndValue <= dimension.inputValue) return false;
        }

        if (!options?.allowNegativeValues) {
            if (dimension.inputValue < 0) return false;
            if (dimension.inputRangeEndValue !== undefined
                && dimension.inputRangeEndValue < 0) return false;
        }

        return true;
    }


    /**
     * Reverts the dimension back to the state before normalization
     *
     * @param dimension gets modified in place
     * @author Daniel de Oliveira
     */
    export function revert(dimension: Dimension) {

        return flow(dimension,
            dissoc('value'),
            dissoc('rangeMin'),
            dissoc('rangeMax'),
            dissoc('isRange'));
    }


    export function addNormalizedValues(dimension: Dimension) {

        if (dimension.inputRangeEndValue !== undefined) {
            dimension.rangeMin = convertValueFromInputUnitToMicrometre(dimension.inputUnit,
                dimension.inputValue);
            dimension.rangeMax = convertValueFromInputUnitToMicrometre(dimension.inputUnit,
                dimension.inputRangeEndValue);
            delete(dimension.value);
        } else {
            dimension.value = convertValueFromInputUnitToMicrometre(dimension.inputUnit,
                dimension.inputValue);
        }
    }


    export function generateLabel(dimension: Dimension,
                                  transform: (value: any) => string|null,
                                  getTranslation: (key: string) => string,
                                  measurementPositionLabel?: string): string {

        let label = (dimension.isImprecise ? 'ca. ' : '');

        if (dimension.inputRangeEndValue !== undefined) {
            label += transform(dimension.inputValue) + '-'
                + transform(dimension.inputRangeEndValue);
        } else {
            label += transform(dimension.inputValue);
        }

        label += ' ' + dimension.inputUnit;

        if (measurementPositionLabel) {
            label += ', ' + getTranslation('asMeasuredBy') +  ' '
                + measurementPositionLabel;
        }
        if (dimension.measurementComment) label += ' (' + dimension.measurementComment + ')';

        return label;
    }


    function convertValueFromInputUnitToMicrometre(inputUnit: 'mm'|'cm'|'m',
                                                   inputValue: number): number {

        switch (inputUnit) {
            case 'mm':
                return inputValue * 1000;
            case 'cm':
                return inputValue * 10000;
            case 'm':
                return inputValue * 1000000;
            default:
                return inputValue;
        }
    }
}
