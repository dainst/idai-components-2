import {ProjectConfiguration} from "./project-configuration";
import {FieldDefinition} from "./field-definition";
import {TypeDefinition} from "./type-definition";

/**
 * @author Daniel de Oliveira
 */
export class ConfigurationPreprocessor {

    constructor() { }

    public go(
        configuration : any,
        extraFields : Array<FieldDefinition>) {

        for (var typeDefinition of configuration['types']) {
            this.addExtraFields(<TypeDefinition>typeDefinition,extraFields)
        }
    }

    private addExtraFields(
        typeDefinition : TypeDefinition,
        extraFields : Array<FieldDefinition>) {

        for (var extraField of extraFields) {
            var fieldAlreadyPresent = false;
            for (var fieldDefinition of (<TypeDefinition>typeDefinition).fields) {
                if ((<FieldDefinition>fieldDefinition).name == extraField.name) {
                    fieldAlreadyPresent = true;
                }
            }
            if (!fieldAlreadyPresent) {
                typeDefinition.fields.push(extraField)
            }
        }
    }
}
