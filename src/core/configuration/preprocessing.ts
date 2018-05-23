import {FieldDefinition} from './field-definition';
import {TypeDefinition} from './type-definition';
import {RelationDefinition} from './relation-definition';
import {UnorderedConfigurationDefinition} from './unordered-configuration-definition';

/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export module Preprocessing {

    export function addCustomFields(configuration: UnorderedConfigurationDefinition, typeName: string, fields: any) {

        const type: TypeDefinition|undefined = configuration.types[typeName];

        if (!type) return;

        Object.keys(fields).forEach(fieldName => {
            const field: any = { name: fieldName };
            Object.assign(field, fields[fieldName]);
            type.fields[fieldName] = field;
        });
    }


    export function applyLanguage(configuration: UnorderedConfigurationDefinition, language: any) {

        if (language.types) {

            for (let langConfTypeName of Object.keys(language.types)) {
                for (let confTypeName of Object.keys(configuration.types)) {
                    if (confTypeName !== langConfTypeName) continue;

                    const confType = configuration.types[confTypeName];
                    const langConfType = language.types[langConfTypeName];

                    if (langConfType.label) confType.label = langConfType.label;

                    if (langConfType.fields) {
                        for (let langConfFieldName of Object.keys(langConfType.fields)) {
                            for (let confFieldName of Object.keys(confType.fields)) {
                                if (confFieldName !== langConfFieldName) continue;

                                const confField = confType.fields[confFieldName];
                                const langConfField = langConfType.fields[langConfFieldName];

                                if (langConfField.label) confField.label = langConfField.label;
                                if (langConfField.description) confField.description = langConfField.description;
                            }
                        }
                    }

                }
            }
        }

        if (language.relations) {

            for (let langConfRelationKey of Object.keys(language.relations)) {
                for (let confRelation of configuration.relations as any) {
                    if (confRelation.name !== langConfRelationKey) continue;

                    const langConfRelation = language.relations[langConfRelationKey];
                    if (langConfRelation.label) confRelation.label = langConfRelation.label;
                }
            }
        }
    }


    export function setIsRecordedInVisibilities(configuration: UnorderedConfigurationDefinition) {

        if (!configuration.relations) return;

        configuration.relations
            .filter((relation: RelationDefinition) => relation.name === 'isRecordedIn')
            .forEach((relation: RelationDefinition) => relation.editable = false);
    }


    export function prepareSameMainTypeResource(configuration: UnorderedConfigurationDefinition) {

        if (!configuration.relations) return;

        for (let relation of configuration.relations) {
            relation.sameMainTypeResource = !((relation as any)['sameOperation'] != undefined
                && (relation as any)['sameOperation'] === false);
        }
    }


    export function addExtraFields(configuration: UnorderedConfigurationDefinition,
                                   extraFields: {[fieldName: string]: FieldDefinition }) {

        for (let typeName of Object.keys(configuration.types)) {
            const typeDefinition = configuration.types[typeName];

            if (!typeDefinition.fields) typeDefinition.fields = {};

            if (typeDefinition.parent == undefined) {
                _addExtraFields(typeDefinition, extraFields)
            }

            for (let fieldName of Object.keys(typeDefinition.fields)) {
                const fieldDefinition = typeDefinition.fields[fieldName];

                if (fieldDefinition.editable == undefined) fieldDefinition.editable = true;
                if (fieldDefinition.visible == undefined) fieldDefinition.visible = true;
            }
        }
    }


    export function addExtraRelations(configuration: UnorderedConfigurationDefinition,
                                      extraRelations: Array<RelationDefinition>) {

        if (!configuration.relations) return;

        for (let extraRelation of extraRelations) {
            let relationAlreadyPresent = false;

            for (const relationDefinition of configuration.relations) {
                if (relationAlreadyExists(relationDefinition, extraRelation)) {
                    relationAlreadyPresent = true;
                }
            }

            if (!relationAlreadyPresent) {
                configuration.relations.splice(0,0, extraRelation);
                expandInherits(configuration, extraRelation, 'range');
                expandInherits(configuration, extraRelation, 'domain');
                expandOnUndefined(configuration, extraRelation, 'range');
                expandOnUndefined(configuration, extraRelation, 'domain');
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
    function relationAlreadyExists(existingRelation: any, extraRelation: any) {

        if (existingRelation.name == extraRelation.name) {
            if (existingRelation.domain && extraRelation.domain) {
                if (existingRelation.domain.sort().toString() ==
                    extraRelation.domain.sort().toString()) return true;
            }
        }
        return false;
    }


    function expandInherits(configuration: UnorderedConfigurationDefinition,
                            extraRelation: RelationDefinition, itemSet: string) {

        if (!extraRelation) return;
        if (!(extraRelation as any)[itemSet]) return;

        const itemsNew = [] as any;
        for (let item of (extraRelation as any)[itemSet]) {
            if (item.indexOf(':inherit') !== -1) {
                for (let typeName of Object.keys(configuration.types)) {
                    const type = configuration.types[typeName];

                    if (type.parent === item.split(':')[0]) {
                        itemsNew.push(typeName);
                    }
                }
                itemsNew.push(item.split(':')[0]);
            } else {
                itemsNew.push(item);
            }
        }
        (extraRelation as any)[itemSet] = itemsNew;
    }


    function expandOnUndefined(configuration: UnorderedConfigurationDefinition,
                               extraRelation_: RelationDefinition, itemSet: string) {

        const extraRelation: any = extraRelation_;

        if (extraRelation[itemSet] != undefined) return;

        let opposite = 'range';
        if (itemSet == 'range') opposite = 'domain';

        extraRelation[itemSet] = [];
        for (let typeName of Object.keys(configuration.types)) {
            if (extraRelation[opposite].indexOf(typeName) == -1) {
                extraRelation[itemSet].push(typeName);
            }
        }
    }


    function mergeFields(target: TypeDefinition, source: TypeDefinition) {

        for (let sourceFieldName of Object.keys(source.fields)) {
            let alreadyPresentInTarget = false;

            for (let targetFieldName of Object.keys(target.fields)) {
                if (targetFieldName == sourceFieldName) alreadyPresentInTarget = true;
            }

            if (!alreadyPresentInTarget) target.fields[sourceFieldName] = source.fields[sourceFieldName];
        }
    }


    export function addExtraTypes(configuration: UnorderedConfigurationDefinition,
                                  extraTypes: {[typeName: string]: TypeDefinition }) {

        for (let extraTypeName of Object.keys(extraTypes)) {
            const extraType = extraTypes[extraTypeName];
            let typeAlreadyPresent = false;

            for (let typeName of Object.keys(configuration.types)) {
                const typeDefinition = configuration.types[typeName];

                if (typeName === extraTypeName) {
                    typeAlreadyPresent = true;
                    mergeFields(typeDefinition, extraType);
                }
            }

            if (!typeAlreadyPresent) configuration.types[extraTypeName] = extraType;
        }
    }


    function _addExtraFields(typeDefinition: TypeDefinition,
                             extraFields: {[fieldName: string]: FieldDefinition }) {

        for (let extraFieldName of Object.keys(extraFields)) {
            let fieldAlreadyPresent = false;

            for (let fieldName of Object.keys(typeDefinition.fields)) {
                if (fieldName === extraFieldName) fieldAlreadyPresent = true;
            }

            if (!fieldAlreadyPresent) {
                typeDefinition.fields[extraFieldName] = Object.assign({}, extraFields[extraFieldName]);
            }
        }
    }
}
