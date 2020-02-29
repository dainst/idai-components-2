import {clone} from 'tsfun/src/struct';


export interface Constraint {

    value: string|string[];
    type: 'add'|'subtract';
}


/**
 * Companion object
 */
export module Constraint {

    export function convert(constraint: Constraint|string|string[]): Constraint {

        return (Array.isArray(constraint) || typeof(constraint) == 'string')
            ? { value: constraint, type: 'add' }
            : complete(constraint);
    }


    function complete(constraint_: Constraint) {

        const constraint = clone(constraint_);
        constraint.type = constraint.type ?? 'add';
        return constraint;
    }
}