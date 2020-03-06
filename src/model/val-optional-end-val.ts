export interface ValOptionalEndVal<T> {

    value: T;
    endValue?: T;
}


export module ValOptionalEndVal {

    export const VALUE = 'value';
    export const ENDVALUE = 'endValue';
}