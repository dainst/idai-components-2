import {Resource} from "../../src/app/core-services/resource";

export interface ExtendedResource extends Resource {
    fieldlist_example? : Array;
    localized_fieldlist_example? : any;
}