export interface OptionalRange {

    value: string;
    endValue?: string;
}


export module OptionalRange {

    export const VALUE = 'value';
    export const ENDVALUE = 'endValue';


    export function isValid(optionalRange: OptionalRange): boolean {

        const keys = Object.keys(optionalRange);
        if (keys.length !== 1 && keys.length !== 2) return false;
        if (keys.length === 1 && keys[0] !== VALUE) return false;
        if (keys.length === 2 && (typeof optionalRange[VALUE] !== typeof optionalRange[ENDVALUE])) return false;
        return true;
    }


    export function generateLabel(optionalRange: OptionalRange,
                                  getTranslation: (key: string) => string): string {

        return optionalRange.endValue
            ? getTranslation('from') + optionalRange.value + getTranslation('to') + optionalRange.endValue
            : optionalRange.value;
    }
}
