import {FieldDefinition} from './field-definition';
import {TypeDefinition} from './type-definition';
import {ConfigurationDefinition} from './configuration-definition';
import {RelationDefinition} from './relation-definition';

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


    /**
     * @param configuration
     */
    public go(
        configuration : ConfigurationDefinition
        ) {

        ConfigurationPreprocessor.addExtraTypes(configuration,this.extraTypes);
        
        for (let typeDefinition of configuration.types) {
            if (!typeDefinition.fields) typeDefinition.fields = [];

            if (typeDefinition.parent == undefined) {
                ConfigurationPreprocessor.addExtraFields(typeDefinition,this.extraFields)
            }
            for (let fieldDefinition of typeDefinition.fields) {
                if (fieldDefinition.editable==undefined) fieldDefinition.editable = true;
                if (fieldDefinition.visible==undefined) fieldDefinition.visible = true;
            }
        }

        if (!configuration.relations) configuration.relations = [];
        ConfigurationPreprocessor.addExtraRelations(configuration, this.extraRelations);
    }


    private static addExtraRelations(configuration : ConfigurationDefinition,
                              extraRelations : Array<RelationDefinition>) {

        if (!configuration.relations) return

        for (let extraRelation of extraRelations) {
            let relationAlreadyPresent = false;
            for (const relationDefinition of configuration.relations) {
                if (ConfigurationPreprocessor.relationAlreadyExists(relationDefinition, extraRelation)) {
                    relationAlreadyPresent = true;
                }
            }
            if (!relationAlreadyPresent) {
                configuration.relations.splice(0,0,extraRelation);
                ConfigurationPreprocessor.expandInherits(configuration, extraRelation, 'range');
                ConfigurationPreprocessor.expandInherits(configuration, extraRelation, 'domain');
                ConfigurationPreprocessor.expandOnUndefined(configuration, extraRelation, 'range');
                ConfigurationPreprocessor.expandOnUndefined(configuration, extraRelation, 'domain');
            }
        }
    }


    /**
     * A relation definition is unique for each name/domain pair
     *
     * @param existingRelation
     * @param extraRelation
     * @returns {boolean}
     */
    private static relationAlreadyExists(existingRelation: any, extraRelation: any) {

        if (existingRelation.name == extraRelation.name) {
            if (existingRelation.domain && extraRelation.domain) {
                if (existingRelation.domain.sort().toString() ==
                    extraRelation.domain.sort().toString()) return true;
            }
        }
        return false;
    }


    private static expandInherits(configuration : ConfigurationDefinition,
                           extraRelation : RelationDefinition, itemSet: string) {

        if (!extraRelation) return;
        if (!(extraRelation as any)[itemSet]) return;

        const itemsNew = [];
        for (let item of (extraRelation as any)[itemSet]) {
            if (item.indexOf(':inherit') != -1) {

                for (let type of configuration.types) {
                    if (type.parent==item.split(':')[0]) {
                        itemsNew.push(type.type as never);
                    }
                }
                itemsNew.push(item.split(':')[0] as never);
            } else {
                itemsNew.push(item as never);
            }
        }
        (extraRelation as any)[itemSet] = itemsNew;
    }


    private static expandOnUndefined(configuration : ConfigurationDefinition,
                              extraRelation_ : RelationDefinition, itemSet: string) {

        const extraRelation: any = extraRelation_;

        if (extraRelation[itemSet] != undefined) return;

        let opposite = 'range';
        if (itemSet == 'range') opposite = 'domain';

        extraRelation[itemSet] = [];
        for (let type of configuration.types) {
            if (extraRelation[opposite].indexOf(type.type) == -1) {
                extraRelation[itemSet].push(type.type)
            }
        }
    }


    private static mergeFields(target:TypeDefinition, source:TypeDefinition) {

        for (let sourceField of source.fields) {

            let alreadyPresentInTarget = false;
            for (let targetField of target.fields) {
                if (targetField.name == sourceField.name) {
                    alreadyPresentInTarget = true;
                }
            }
            if (!alreadyPresentInTarget) {
                target.fields.push(sourceField);
            }
        }
    }


    private static addExtraTypes(
        configuration : ConfigurationDefinition,
        extraTypes : Array<TypeDefinition>) {

        for (let extraType of extraTypes) {
            let typeAlreadyPresent = false;

            for (let typeDefinition of configuration.types) {

                if ((<TypeDefinition>typeDefinition).type
                    == (<TypeDefinition>extraType).type) {

                    typeAlreadyPresent = true;
                    ConfigurationPreprocessor.mergeFields(typeDefinition,extraType);
                }
            }

            if (!typeAlreadyPresent) {
                configuration.types.push(extraType);
            }
        }
    }


    private static addExtraFields(
        typeDefinition : TypeDefinition,
        extraFields : Array<FieldDefinition>) {

        for (let extraField of extraFields) {
            let fieldAlreadyPresent = false;
            for (let fieldDefinition of (<TypeDefinition>typeDefinition).fields) {
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
