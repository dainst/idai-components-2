import {cond, empty, flow, forEach, identity, includedIn, isNot, map, remove} from "tsfun";


export function assertFieldsAreValid(fields: any /* TODO improve on typing */) {

    flow(
        fields,
        Object.values,
        map(Object.keys),
        map(remove(includedIn(['valuelistId', 'inputType', 'positionValues']))),
        forEach(
            cond(isNot(empty),
                (keys: string) => { throw ['type field with extra keys', keys]},
                identity))); // TODO replace with nop
}