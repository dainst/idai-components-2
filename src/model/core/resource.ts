import {NewResource} from './new-resource';
import {unique, isNot, tripleEqual, jsonEqual} from 'tsfun';
import {arrayEquivalentBy} from 'tsfun-core';


export interface Resource extends NewResource {

    id: string;
}

/**
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
export module Resource {


    export function getDifferingFields(resource1: Resource, resource2: Resource): string[] {

        const differingFieldsNames: string[]
            = findDifferingFieldsInResource(resource1, resource2)
            .concat(findDifferingFieldsInResource(resource2, resource1));

        return unique(differingFieldsNames);
    }


    function findDifferingFieldsInResource(resource1: Object, resource2: Object): string[] {

        return Object.keys(resource1)
            .filter(isNot(tripleEqual('relations')))
            .reduce(
                concatIf(notCompareInBoth(resource1, resource2)),
                [] as string[]);
    }


    const notCompareInBoth = (l: any, r: any) => (key: string) =>
        !compare((l)[key], (r)[key]);


    export const concatIf = (f: (_: string) => boolean) => (acc: string[], val: string) =>
        f(val) ? acc.concat([val as string]) : acc;


    export function compare(value1: any, value2: any): boolean {

        if (!value1 && !value2) return true;
        if ((value1 && !value2) || (!value1 && value2)) return false;

        const type1: string = getType(value1);
        const type2: string = getType(value2);

        if (type1 !== type2) return false;

        if (type1 === 'array' && type2 === 'array') {
            return arrayEquivalentBy(jsonEqual)(value1)(value2)
        }

        return jsonEqual(value1)(value2);
    }


    function getType(value: any): string {

        return typeof value == 'object'
            ? value instanceof Array
                ? 'array'
                : 'object'
            : 'flat';
    }
}