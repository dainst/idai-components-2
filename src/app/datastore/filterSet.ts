import {Filter} from './filter'

export interface FilterSet {
    filters: Array<Filter>;
    type: string;   // and | or
}
