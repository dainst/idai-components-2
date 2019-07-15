/**
 * @author Thomas Kleinke
 */
export interface Dating {

    type: 'range'|'exact'|'before'|'after'|'scientific',

    begin?: DatingElement,
    end?: DatingElement,

    margin?: number,
    source?: string,
    isImprecise?: boolean,
    isUncertain?: boolean,

    label?: string  // Deprecated
}


export interface DatingElement {

    // Normalized value calculated from input values
    year: number;

    // Input values as typed in by the user
    inputYear: number;
    inputType: 'bce'|'ce'|'bp';
}