import {Filter} from './filter'

export interface Query {
    q: string;
    filters?: Filter[];
}
