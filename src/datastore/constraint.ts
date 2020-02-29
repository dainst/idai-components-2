export interface Constraint {

    value: string|string[];
    subtract?: true
}


export module Constraint {

    export function convert(constraint: Constraint|string|string[]): Constraint {

        return (Array.isArray(constraint) || typeof(constraint) == 'string')
            ? { value: constraint }
            : constraint;
    }
}