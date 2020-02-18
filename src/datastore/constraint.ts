export interface Constraint {

    value: string|string[];
    type: string;   // add | subtract
    searchRecursively?: boolean;
}


export class Constraint {

    public static convertTo(constraint: Constraint|string|string[]): Constraint {

        return (Array.isArray(constraint) || typeof(constraint) == 'string')
            ? { value: constraint, type: 'add', searchRecursively: false }
            : constraint;
    }
}