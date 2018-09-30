import {unique, arrayEquivalent, flatMap, flow, includedIn, objectEqualBy} from 'tsfun';


export interface Relations {
    [propName: string]: string[];
}


export const relationsEquivalent = (r1: Relations) => (r2: Relations) => {

    return objectEqualBy(arrayEquivalent)(r1)(r2);
};


/**
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
export module Relations {

    export function getAllTargets(relations: Relations, allowedRelations?: string[]): Array<string> {

        const ownKeys = Object.keys(relations)
            .filter(prop => relations.hasOwnProperty(prop));

        const usableRelations = allowedRelations
            ? ownKeys.filter(includedIn(allowedRelations))
            : ownKeys;

        return flatMap((prop: string) => relations[prop as string])(usableRelations);
    }


    export function getDifferent(relations1: Relations, relations2: Relations): string[] {

        const differingRelationNames: string[]
            = findDifferingFieldsInRelations(relations1, relations2)
            .concat(findDifferingFieldsInRelations(relations2, relations1));

        return unique(differingRelationNames);
    }


    function findDifferingFieldsInRelations(relations1: Object, relations2: Object):  string[] {

        return Object.keys(relations1)
            .reduce(
                concatIf(notArrayEquivalentInBoth(relations1, relations2)),
                []);
    }


    const notArrayEquivalentInBoth = (l: any, r: any) => (key: string) => {

        if (!r[key]) return true;

        return !arrayEquivalent(l[key])(r[key]);
    };


    // TODO possibly put to tsfun
    const concatIf = (f: (_: string) => boolean) => (acc: string[], val: string) =>
        f(val) ? acc.concat([val as string]) : acc;
}