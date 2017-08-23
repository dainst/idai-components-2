import {Document} from "../model/document";

/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export interface DocumentChange {

    type: string; // deleted | changed | created
    resourceId: string;

    document?: Document; // on created or changed
}
