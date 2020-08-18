import {Dimension} from './dimension';

export namespace DimensionVerticalExtent {

    import VALID_FIELDS = Dimension.VALID_FIELDS;
    import VALID_INPUT_UNITS = Dimension.VALID_INPUT_UNITS;

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
}