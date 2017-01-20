import {FieldDefinition} from "./field-definition";
import {TypeDefinition} from "./type-definition";
import {ConfigurationDefinition} from "./configuration-definition";
import {RelationDefinition} from "./relation-definition";

/**
 * @author Daniel de Oliveira
 */
export class ConfigurationPreprocessor {

    /**
     * @param extraTypes fields of an extra type are merged if there is a type of its name already.
     * @param extraFields are added to every type including the extra types.
     * @param extraRelations an extra relation is added only if there is no relation of its name defined yet.
     */
    constructor(private extraTypes : Array<TypeDefinition>,
                private extraFields : Array<FieldDefinition>,
                private extraRelations : Array<RelationDefinition>) { }

    // TODO make it return a copy
    /**
     * @param configuration
     */
    public go(
        configuration : ConfigurationDefinition
        ) {

        this.addExtraTypes(configuration,this.extraTypes);
        
        for (var typeDefinition of configuration.types) {
            if (!typeDefinition.fields) typeDefinition.fields = [];

            if (typeDefinition.parent == undefined) {
                this.addExtraFields(typeDefinition,this.extraFields)
            }
            for (var fieldDefinition of typeDefinition.fields) {
                if (fieldDefinition.editable==undefined) fieldDefinition.editable = true;
                if (fieldDefinition.visible==undefined) fieldDefinition.visible = true;
            }
        }

        if (!configuration.relations) configuration.relations = [];
        this.addExtraRelations(configuration, this.extraRelations);
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
                this.expandOnUndefined(configuration, extraRelation, 'range');
                this.expandOnUndefined(configuration, extraRelation, 'domain');
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


    private expandOnUndefined(configuration : ConfigurationDefinition,
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
