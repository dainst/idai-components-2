import { isObject, isString } from 'tsfun';

export interface OptionalRange {

    value: string;
    endValue?: string;
}


export module OptionalRange {

    export const VALUE = 'value';
    export const ENDVALUE = 'endValue';


    export type Translations = 'from'|'to';


    export function isOptionalRange(optionalRange: any): optionalRange is OptionalRange {

        if (!isObject(optionalRange)) return false;
        if (optionalRange.value && !isString(optionalRange.value)) return false;
        if (optionalRange.endValue && !isString(optionalRange.endValue)) return false;
        return isValid(optionalRange);
    }


    export function isValid(optionalRange: OptionalRange): boolean {

        const keys = Object.keys(optionalRange);
        if (keys.length < 1 || keys.length > 2) return false;
        if (keys.length === 1 && keys[0] !== VALUE) return false;
        if (keys.length === 2 && (!keys.includes(VALUE) || !keys.includes(ENDVALUE))) return false;
        return true;
    }


    export function generateLabel(optionalRange: OptionalRange,
                                  getTranslation: (term: OptionalRange.Translations) => string,
                                  getLabel: (object: any) => string): string {

        return optionalRange.endValue
            ? getTranslation('from') + getLabel(optionalRange.value) + getTranslation('to')
                + getLabel(optionalRange.endValue)
            : getLabel(optionalRange.value);
    }
}
