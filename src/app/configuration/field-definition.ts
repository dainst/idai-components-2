/**
 * @author Daniel de Oliveira
 */
export interface FieldDefinition {
    label? : string;
    name: string;
    description?: string;
    editable? : boolean;  // defaults to true
    visible? : boolean;   // defaults to true
    mandatory? : boolean; // defaults to false
}