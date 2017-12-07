export interface Constraint {
    value: string;
    type: string;   // add | subtract
}


/**
 * Companion object
 */
export class Constraint {

    public static convertTo(constraint: Constraint|string): Constraint {

        return (typeof(constraint) == 'string') ?
            {value: constraint, type: 'add' } : constraint;
    }
}