import {Resource} from './resource'

export interface Document {
    resource : Resource;
    modified?: Date;
    created?: Date;
}