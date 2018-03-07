import {NewResource} from "./new-resource";
import {Action} from './action';

export interface NewDocument {

    resource : NewResource;
    modified?: Action[];
    created?: Action;
}