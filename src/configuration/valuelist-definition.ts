/**
 * @author Daniel de Oliveira
 *
 *
 */
export interface ValuelistDefinition {

    extends?: string;
    createdBy?: string;
    description: { [language: string]: string }
    values: { [key: string]: ValueDefinition }
}


export module ValuelistDefinition {

    export function isValid(valuelistDefinition: ValuelistDefinition): boolean {

        return true; // TODO implement properly, see if we can unify handling with cases like Document.isValid
    }


    export function assertIsValid(valuelistDefinition: ValuelistDefinition) {

        // TODO throw if not is Valid
    }
}


export interface ValueDefinition {

    translation?: { [language: string]: string },
    references?: { [referenceKey: string]: string },
}


export interface ValuelistDefinitions { [key: string]: ValuelistDefinition }