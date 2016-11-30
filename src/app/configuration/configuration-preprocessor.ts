import {ProjectConfiguration} from "./project-configuration";
import {FieldDefinition} from "./field-definition";
import {TypeDefinition} from "./type-definition";

/**
 * @author Daniel de Oliveira
 */
export class ConfigurationPreprocessor {

    constructor() { }

    // TODO make it return a copy
    public go(
        configuration : any,
        extraFields : Array<FieldDefinition>,
        extraTypes : Array<TypeDefinition>) {

        if (extraTypes.length == 0) {
            for (var typeDefinition of configuration['types']) {
                this.addExtraFields(<TypeDefinition>typeDefinition,extraFields)
            }
            return;
        }

        for (var extraType of extraTypes) {
            var typeAlreadyPresent = false;

            for (var typeDefinition of configuration['types']) {

                if ((<TypeDefinition>typeDefinition).type
                    == (<TypeDefinition>extraType).type) {

                    typeAlreadyPresent = true;
                    this.mergeFields(typeDefinition,extraType);
                    this.addExtraFields(typeDefinition,extraFields)
                }

            }

            if (!typeAlreadyPresent) {
                this.addExtraFields(extraType,extraFields);
                configuration['types'].push(extraType);
            }
        }
    }

    private mergeFields(target:TypeDefinition, source:TypeDefinition) {
        for (var sourceField of source.fields) {

            var alreadyPresentInTarget = false;
            for (var targetField of target.fields) {
                if (targetField.name == sourceField.name) {
                    alreadyPresentInTarget = true;
                }
            }
            if (!alreadyPresentInTarget) {
                target.fields.push(sourceField);
            }
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
                typeDefinition.fields.splice(0,0,extraField)
            }
        }
    }
}
