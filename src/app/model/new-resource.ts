import {Relations} from './relations'

export interface NewResource {

    id?: string;
    type: string;
    relations: Relations;
    [propName: string]: any;
}