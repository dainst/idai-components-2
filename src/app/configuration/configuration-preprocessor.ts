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
        
        for (var typeDefinition of configuration.types) {
            if (!typeDefinition.fields) typeDefinition.fields = [];

            if (typeDefinition.parent == undefined) {
                this.addExtraFields(typeDefinition,extraFields)
            }
            for (var fieldDefinition of typeDefinition.fields) {
                if (fieldDefinition.editable==undefined) fieldDefinition.editable = true;
                if (fieldDefinition.visible==undefined) fieldDefinition.visible = true;
            }
        }

        if (!configuration.relations) configuration.relations = [];
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
                configuration.relations.splice(0,0,extraRelation);
                this.expandInherits(configuration, extraRelation, 'range');
                this.expandInherits(configuration, extraRelation, 'domain');
                this.expandAllMarker(configuration, extraRelation, 'range');
                this.expandAllMarker(configuration, extraRelation, 'domain');
            }
        }
    }

    private expandInherits(configuration : ConfigurationDefinition,
                           extraRelation : RelationDefinition, itemSet: string) {
        if (!extraRelation[itemSet]) return;

        var itemsNew = [];
        for (var item of extraRelation[itemSet]) {
            if (item.indexOf(':inherit') != -1) {

                for (var type of configuration.types) {
                    if (type.parent==item.split(':')[0]) {
                        itemsNew.push(type.type);
                    }
                }
                itemsNew.push(item.split(':')[0]);
            } else {
                itemsNew.push(item);
            }
        }
        extraRelation[itemSet] = itemsNew;
    }


    private expandAllMarker(configuration : ConfigurationDefinition,
                            extraRelation : RelationDefinition, itemSet: string) {

        if (extraRelation[itemSet] != undefined) return;

        var opposite = 'range';
        if (itemSet == 'range') opposite = 'domain';

        extraRelation[itemSet] = [];
        for (var type of configuration.types) {
            if (extraRelation[opposite].indexOf(type.type) == -1) {
                extraRelation[itemSet].push(type.type)
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

            for (var typeDefinition of configuration.types) {

                if ((<TypeDefinition>typeDefinition).type
                    == (<TypeDefinition>extraType).type) {

                    typeAlreadyPresent = true;
                    this.mergeFields(typeDefinition,extraType);
                }
            }

            if (!typeAlreadyPresent) {
                configuration.types.push(extraType);
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
