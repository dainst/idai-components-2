

/**
 * @author Thomas Kleinke
 */
export interface Dimension {

    // Input values as typed in by the user (in mm/cm/m, defined in inputUnit)
    inputValue: number;
    inputRangeEndValue?: number;
    inputUnit: 'mm'|'cm'|'m';

    measurementPosition?: string;
    measurementComment?: string;
    isImprecise: boolean;

    label?: string; // TODO review; Deprecated
}


/**
 * @author Fabian Z.
 * @author Thomas Kleinke
 */
export module Dimension {

    export const INPUTVALUE = 'inputValue';
    export const INPUTRANGEENDVALUE = 'inputRangeEndValue';
    export const INPUTUNIT = 'inputUnit';
    export const MEASUREMENTPOSITION = 'measurementPosition';
    export const MEASUREMENTCOMMENT = 'measurementComment';
    export const ISIMPRECISE = 'isImprecise';

    const VALID_FIELDS = [INPUTVALUE, INPUTRANGEENDVALUE, INPUTUNIT,
        MEASUREMENTPOSITION, MEASUREMENTCOMMENT, ISIMPRECISE];

    const VALID_INPUT_UNITS = ['mm', 'cm', 'm'];


    /**
     * Note: There still may be dimension['isRange'] boolean values stored in the database.
     * These should be handled properly if we're up to changing things here, for example if
     * we want to make sure only defined fields are present.
     *
     * @param dimension
     */
    export function isValid(dimension: Dimension): boolean {

        for (const fieldName in dimension) {
            if (!VALID_FIELDS.includes(fieldName)) return false;
        }

        if (dimension.label) return true;
        if (!dimension.inputValue || !dimension.inputUnit) return false;
        if (!VALID_INPUT_UNITS.includes(dimension.inputUnit)) return false;

        return typeof(dimension.inputValue) === 'number'
            && (!dimension.inputRangeEndValue || typeof(dimension.inputRangeEndValue) === 'number');
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
}
