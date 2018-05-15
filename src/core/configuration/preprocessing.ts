import {FieldDefinition} from './field-definition';
import {TypeDefinition} from './type-definition';
import {ConfigurationDefinition} from './configuration-definition';
import {RelationDefinition} from './relation-definition';

/**
 * @author Daniel de Oliveira
 */
export module Preprocessing {

    export function applyLanguage(configuration: ConfigurationDefinition, language: any) {

        if (language.types) {

            for (let langConfTypeKey of Object.keys(language.types)) {
                for (let confType of configuration.types) {
                    if (confType.type !== langConfTypeKey) continue;

                    const langConfType = language.types[langConfTypeKey];
                    if (langConfType.label) confType.label = langConfType.label;

                    if (langConfType.fields) {
                        for (let langConfFieldKey of Object.keys(langConfType.fields)) {
                            for (let confField of confType.fields) {
                                if (confField.name !== langConfFieldKey) continue;

                                const langConfField = langConfType.fields[langConfFieldKey];
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


    export function setIsRecordedInVisibilities(configuration: ConfigurationDefinition) {

        if (!configuration.relations) return;

        configuration.relations
            .filter((relation: RelationDefinition) => relation.name === 'isRecordedIn')
            .forEach((relation: RelationDefinition) => relation.editable = false);
    }


    export function prepareSameMainTypeResource(configuration: ConfigurationDefinition) {

        if (!configuration.relations) return;

        for (let relation of configuration.relations) {
            relation.sameMainTypeResource = !((relation as any)['sameOperation'] != undefined
                && (relation as any)['sameOperation'] === false);
        }
    }


    export function addExtraFields(configuration: ConfigurationDefinition,
                                   extraFields: Array<FieldDefinition>) {

        for (let typeDefinition of configuration.types) {
            if (!typeDefinition.fields) typeDefinition.fields = [];

            if (typeDefinition.parent == undefined) {
                _addExtraFields(typeDefinition, extraFields)
            }

            for (let fieldDefinition of typeDefinition.fields) {
                if (fieldDefinition.editable == undefined) fieldDefinition.editable = true;
                if (fieldDefinition.visible == undefined) fieldDefinition.visible = true;
            }
        }
    }


    export function addExtraRelations(configuration: ConfigurationDefinition,
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
                configuration.relations.splice(0,0,extraRelation);
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


    function expandInherits(configuration: ConfigurationDefinition,
                           extraRelation: RelationDefinition, itemSet: string) {

        if (!extraRelation) return;
        if (!(extraRelation as any)[itemSet]) return;

        const itemsNew = [] as any;
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


    function expandOnUndefined(configuration: ConfigurationDefinition,
                              extraRelation_: RelationDefinition, itemSet: string) {

        const extraRelation: any = extraRelation_;

        if (extraRelation[itemSet] != undefined) return;

        let opposite = 'range';
        if (itemSet == 'range') opposite = 'domain';

        extraRelation[itemSet] = [];
        for (let type of configuration.types) {
            if (extraRelation[opposite].indexOf(type.type) == -1) {
                extraRelation[itemSet].push(type.type);
            }
        }
    }


    function mergeFields(target: TypeDefinition, source: TypeDefinition) {

        for (let sourceField of source.fields) {
            let alreadyPresentInTarget = false;

            for (let targetField of target.fields) {
                if (targetField.name == sourceField.name) {
                    alreadyPresentInTarget = true;
                }
            }

            if (!alreadyPresentInTarget) target.fields.push(sourceField);
        }
    }


    export function addExtraTypes(configuration: ConfigurationDefinition, extraTypes: Array<TypeDefinition>) {

        for (let extraType of extraTypes) {
            let typeAlreadyPresent = false;

            for (let typeDefinition of configuration.types) {

                if ((<TypeDefinition>typeDefinition).type
                    == (<TypeDefinition>extraType).type) {

                    typeAlreadyPresent = true;
                    mergeFields(typeDefinition,extraType);
                }
            }

            if (!typeAlreadyPresent) configuration.types.push(extraType);
        }
    }


    function _addExtraFields(typeDefinition: TypeDefinition, extraFields: Array<FieldDefinition>) {

        for (let extraField of extraFields) {
            let fieldAlreadyPresent = false;

            for (let fieldDefinition of (<TypeDefinition>typeDefinition).fields) {
                if ((<FieldDefinition>fieldDefinition).name == extraField.name) {
                    fieldAlreadyPresent = true;
                }
            }

            if (!fieldAlreadyPresent) typeDefinition.fields.splice(0, 0, extraField);
        }
    }
}
