import {FilterSet} from './filterSet'

export interface Query {
    q: string;
    filterSets?: Array<FilterSet>;
}
