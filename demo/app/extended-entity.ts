import {Entity} from "../../lib/app/core-services/entity";

export interface ExtendedEntity extends Entity {
    fieldlist_example? : Array;
    localized_fieldlist_example? : any;
}