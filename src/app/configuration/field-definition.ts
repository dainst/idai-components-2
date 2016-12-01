/**
 * @author Daniel de Oliveira
 */
export interface FieldDefinition {
    label? : string;
    name: string;
    description?: string;
    editable? : boolean;
    visible? : boolean;
}