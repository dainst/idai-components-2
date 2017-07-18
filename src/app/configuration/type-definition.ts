/**
 * @author Daniel de Oliveira
 */
export interface TypeDefinition {
    label? : string;
    type: string;
    abstract? : boolean;
    fields? : any;
    parent? : string;
    color? : string;
}