import {Relations} from './relations'

export interface Resource {
    id?: string;
    type: string;
    relations: Relations;
    [propName: string]: any;
}