import {Resource} from './resource'
import {Action} from './action'

export interface Document {
    resource : Resource;
    modified?: Action[];
    created?: Action;
}