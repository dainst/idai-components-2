/**
 * @author Thomas Kleinke
 */
export interface Dating {

    type: 'range'|'exact'|'before'|'after'|'scientific',
    begin?: { year: number, type: 'bce'|'ce'|'bp' },
    end?: { year: number, type: 'bce'|'ce'|'bp' },
    margin?: number,
    source?: string,
    isImprecise?: boolean,
    isUncertain?: boolean,
    label?: string  // Deprecated
}