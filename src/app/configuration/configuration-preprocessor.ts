import {FieldDefinition} from "./field-definition";
import {TypeDefinition} from "./type-definition";
import {ConfigurationDefinition} from "./configuration-definition";
import {RelationDefinition} from "./relation-definition";

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
     * @param extraRelations
     */
    public go(
        configuration : ConfigurationDefinition,
        extraTypes : Array<TypeDefinition>,
        extraFields : Array<FieldDefinition>,
        extraRelations : Array<RelationDefinition>
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

        this.addExtraRelations(configuration, extraRelations);
    }

    private addExtraRelations(configuration : ConfigurationDefinition,
                              extraRelations : Array<RelationDefinition>) {

        for (var extraRelation of extraRelations) {
            var relationAlreadyPresent = false;
            for (var relationDefinition of configuration.relations) {
                if ((<FieldDefinition>relationDefinition).name == extraRelation.name) {
                    relationAlreadyPresent = true;
                }
            }
            if (!relationAlreadyPresent) {

                // ALL
                if (extraRelation.range.indexOf("ALL") != -1) {
                    extraRelation.range = [];
                    for (var type of configuration.types) {
                        if (type.type != extraRelation.domain[0]) {
                            extraRelation.range.push(type.type)
                        }
                    }
                } else if (extraRelation.domain.indexOf("ALL") != -1) {
                    extraRelation.domain = [];
                    for (var type of configuration.types) {
                        if (type.type != extraRelation.range[0]) {
                            extraRelation.domain.push(type.type)
                        }
                    }
                }
                //

                configuration.relations.splice(0,0,extraRelation)
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
