import {FieldDefinition} from './field-definition';
import {TypeDefinition} from './type-definition';
import {RelationDefinition} from './relation-definition';
import {UnorderedConfigurationDefinition} from './unordered-configuration-definition';
import {
    compose,
    empty,
    filter,
    flow,
    forEach,
    isDefined,
    isNot,
    map,
    on,
    subtract,
    to
} from 'tsfun';
import {ConfigurationDefinition} from './configuration-definition';


export function pureName(s: string) { // TODO remove

    return  s.includes(':') ? s.substr(0, s.indexOf(':')) : s;
}


/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export module Preprocessing {


    export function preprocess2(appConfiguration: any,
                                languageConfiguration: any,
                                customLanguageConfiguration: any,
                                searchConfiguration: any,
                                valuelistsConfiguration: any,
                                orderConfiguration: any,
                                extraFields: any,
                                relations: any,
                                defaultFields: any) {

        appConfiguration.relations = [];
        addExtraFields(appConfiguration, extraFields);
        addExtraRelations(appConfiguration, relations);
        addExtraFields(appConfiguration, defaultFields);

        applyLanguage(appConfiguration, languageConfiguration); // TODO test it
        applyLanguage(appConfiguration, customLanguageConfiguration); // TODO test it

        applySearchConfiguration(appConfiguration, searchConfiguration);

        applyValuelistsConfiguration(appConfiguration.types, valuelistsConfiguration);
        addExtraFieldsOrder(appConfiguration, orderConfiguration);

        return {
            identifier: appConfiguration.identifier,
            relations: appConfiguration.relations,
            types: getOrderedTypes(appConfiguration, orderConfiguration)
        } as ConfigurationDefinition;
    }





    export function applyLanguage(configuration: UnorderedConfigurationDefinition, language: any) {

        if (configuration.types) {
            for (let confTypeName of Object.keys(configuration.types)) {
                const confType = configuration.types[confTypeName];

                if (language.types && language.types[confTypeName] && language.types[confTypeName].label) {
                    confType.label = language.types[confTypeName].label;
                }

                for (let confFieldName of Object.keys(confType.fields)) {
                    let descriptionFoundInTypes = false;
                    let labelFoundInTypes = false;

                    const confField = confType.fields[confFieldName];

                    if (language.types) {
                        const langConfType = language.types[confTypeName];
                        if (langConfType && langConfType.fields) {
                            const langConfField = langConfType.fields[confFieldName];
                            if (langConfField) {
                                if (langConfField.label) {
                                    labelFoundInTypes = true;
                                    confField.label = langConfField.label;
                                }
                                if (langConfField.description) {
                                    descriptionFoundInTypes = true;
                                    confField.description = langConfField.description;
                                }
                            }
                        }
                    }

                    if (!labelFoundInTypes && language.commons) {
                        if (language.commons[confFieldName] && language.commons[confFieldName].label) {
                            confField.label = language.commons[confFieldName].label;
                        }
                    }
                    if (!descriptionFoundInTypes && language.commons) {
                        if (language.commons[confFieldName] && language.commons[confFieldName].description) {
                            confField.description = language.commons[confFieldName].description;
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


    export function applySearchConfiguration(configuration: UnorderedConfigurationDefinition,
                                             searchConfiguration: any) {

        Object.keys(searchConfiguration).forEach(typeName => {
            const type: TypeDefinition = configuration.types[typeName];
            if (!type) return;

            applySearchConfigurationForType(searchConfiguration, type, typeName, 'fulltext',
                'fulltextIndexed');
            applySearchConfigurationForType(searchConfiguration, type, typeName, 'constraint',
                'constraintIndexed');
        });
    }


    export function applyValuelistsConfiguration(types: { [typeName: string]: TypeDefinition },
                                                 valuelistsConfiguration: {[id: string]: {values: string[]}}) {

        const processFields = compose(
            Object.values,
            filter(on('valuelistId', isDefined)),
            forEach((fd: FieldDefinition) => (fd as any)['valuelist']
                = Object.keys(valuelistsConfiguration[
                    (fd as any)['valuelistId']
                ].values)));

        flow(types,
            Object.values,
            filter(isDefined),
            map(to('fields')),
            forEach(processFields));
    }


    function applySearchConfigurationForType(searchConfiguration: any, type: TypeDefinition, typeName: string,
                                             indexType: string, indexFieldName: string) {

        const fulltextFieldNames: string[]|undefined = searchConfiguration[typeName][indexType];
        if (!fulltextFieldNames) return;

        fulltextFieldNames.forEach(fieldName => {
            const field = type.fields[fieldName];
            if (field) field[indexFieldName] = true;
        });
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

            if (relation.name === 'isRecordedIn') { // See #8992
                relation.sameMainTypeResource = false;
                continue;
            }

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

            // TODO Check if this is really the right place to do this
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

            expandInherits(configuration, extraRelation, 'domain');

            configuration.relations
                .filter(on('name')(extraRelation))
                .forEach(relation => { // TODO use update function
                    relation.domain = subtract(extraRelation.domain)(relation.domain)
                });
            configuration.relations = configuration.relations.filter(isNot(on('domain', empty)));

            configuration.relations.splice(0,0, extraRelation);

            expandInherits(configuration, extraRelation, 'range');
            expandOnUndefined(configuration, extraRelation, 'range');
            expandOnUndefined(configuration, extraRelation, 'domain');
        }
    }


    function expandInherits(configuration: Readonly<UnorderedConfigurationDefinition>,
                            extraRelation: RelationDefinition,
                            itemSet: string) {

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


    function addExtraFieldsOrder(appConfiguration: UnorderedConfigurationDefinition, // TODO remove
            orderConfiguration: any) {

        if (!orderConfiguration.fields) orderConfiguration.fields = {};

        Object.keys(appConfiguration.types).forEach(typeName => {
            if (!orderConfiguration.fields[typeName]) orderConfiguration.fields[typeName] = [];
            orderConfiguration.fields[typeName]
                = [].concat(orderConfiguration.fields[typeName]);
        });
    }


    function getOrderedTypes(appConfiguration: UnorderedConfigurationDefinition,
            orderConfiguration: any): Array<TypeDefinition> {

            const types: Array<TypeDefinition> = [];

        if (orderConfiguration.types) {
            orderConfiguration.types.forEach((typeName: string) => {
                const type: TypeDefinition | undefined = appConfiguration.types[typeName];
                if (type) addToOrderedTypes(type, typeName, types, orderConfiguration);
            });
        }

        Object.keys(appConfiguration.types).forEach(typeName => {
            if (!types.find(type => type.type === typeName)) {
                addToOrderedTypes(appConfiguration.types[typeName], typeName, types, orderConfiguration);
            }
        });

        return types;
    }


    function addToOrderedTypes(type: TypeDefinition, typeName: string, types: Array<TypeDefinition>,
        orderConfiguration: any) {

        if (types.includes(type)) return;

        type.type = typeName;
        type.fields = getOrderedFields(type, orderConfiguration);
        types.push(type);
    }


    function getOrderedFields(type: TypeDefinition, orderConfiguration: any): Array<FieldDefinition> {

            const fields: Array<FieldDefinition> = [];

        if (!type.fields) return fields;

        if (orderConfiguration.fields[type.type]) {
            orderConfiguration.fields[type.type].forEach((fieldName: string) => {
                const field: FieldDefinition | undefined = type.fields[fieldName];
                if (field) addToOrderedFields(field, fieldName, fields);
            });
        }

        Object.keys(type.fields).forEach(fieldName => {
            if (!fields.find(field => field.name === fieldName)) {
                addToOrderedFields(type.fields[fieldName], fieldName, fields);
            }
        });

        return fields;
    }


    function addToOrderedFields(field: FieldDefinition, fieldName: string,
        fields: Array<FieldDefinition>) {

        if (fields.includes(field)) return;

        field.name = fieldName;
        fields.push(field);
    }
}
