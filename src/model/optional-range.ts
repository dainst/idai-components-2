export interface OptionalRange<T> {

    value: T;
    endValue?: T;
}


export module OptionalRange {

    export const VALUE = 'value';
    export const ENDVALUE = 'endValue';


    export function isValid<T>(optionalRange: OptionalRange<T>): boolean {

        const keys = Object.keys(optionalRange);
        if (keys.length === 1 && keys[0] !== VALUE) return false;
        if (keys.length === 2 && (typeof optionalRange[VALUE] !== typeof optionalRange[ENDVALUE])) return false;
        return true;
    }
}