import {FieldDefinition} from "./field-definition";
import {TypeDefinition} from "./type-definition";
import {ConfigurationDefinition} from "./configuration-definition";

/**
 * @author Daniel de Oliveira
 */
export class ConfigurationPreprocessor {

    constructor() { }

    // TODO make it return a copy
    /**
     * @param configuration
     * @param extraTypes
     * @param extraFields
     */
    public go(
        configuration : ConfigurationDefinition,
        extraTypes : Array<TypeDefinition>,
        extraFields : Array<FieldDefinition>
        ) {
        
        this.addExtraTypes(configuration,extraTypes);
        
        for (var typeDefinition of configuration['types']) {
            if (typeDefinition.parent == undefined) {
                this.addExtraFields(typeDefinition,extraFields)
            }
            for (var fieldDefinition of typeDefinition.fields) {
                if (fieldDefinition.editable==undefined) fieldDefinition.editable = true;
                if (fieldDefinition.visible==undefined) fieldDefinition.visible = true;
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

    private addExtraTypes(
        configuration : ConfigurationDefinition,
        extraTypes : Array<TypeDefinition>) {

        for (var extraType of extraTypes) {
            var typeAlreadyPresent = false;

            for (var typeDefinition of configuration['types']) {

                if ((<TypeDefinition>typeDefinition).type
                    == (<TypeDefinition>extraType).type) {

                    typeAlreadyPresent = true;
                    this.mergeFields(typeDefinition,extraType);
                }
            }

            if (!typeAlreadyPresent) {
                configuration['types'].push(extraType);
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
