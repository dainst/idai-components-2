import {ObjectCollection, ObjectSet, identity, subtract} from 'tsfun';


/* internal, duplicated from tsfun */
export const mapProperties = <A, B>(f: (_: A) => B) =>
    (keys: Array<number|string>, o: ObjectCollection<A>): ObjectCollection<B> =>
        keys.reduce(mapPropertiesReducer(f)(o), {});
/* internal, duplicated from tsfun */
const mapPropertiesReducer = <A, B>(f: (_: A) => B) =>
    (o: any) => (acc: any, val: string) => (acc[val] = f(o[val]), acc);

// ------------ @author Daniel de Oliveira -----------------

export const subtractObj = (subtrahend: Array<string | number> | any) =>
    (o: ObjectSet): ObjectSet => {

        if (Array.isArray(o)) throw new TypeError('invalid argument');

        const keys =
            (
                Array.isArray(subtrahend)
                    ? subtract(subtrahend.map(_ => _.toString()))
                    : subtract(Object.keys(subtrahend))

            )(Object.keys(o));

        return mapProperties(identity)(
            keys,
            o);
    };
