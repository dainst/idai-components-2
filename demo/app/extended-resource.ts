import {Resource} from "../../src/core/model/resource";

export interface ExtendedResource extends Resource {
    fieldlist_example? : Array<any>;
    localized_fieldlist_example? : any;
}