import {FieldDefinition} from './field-definition';
import {TypeDefinition} from './type-definition';
import {RelationDefinition} from './relation-definition';
import {UnorderedConfigurationDefinition} from './unordered-configuration-definition';
import {clone, compose, empty, filter, flow, forEach, is, isDefined, isNot, map, on, subtract, to} from 'tsfun';
import {ConfigurationErrors} from './configuration-errors';
import {ConfigurationDefinition} from './configuration-definition';


/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export module Preprocessing {


    /**
     * Merges the core, Fields.json and custom fields config
     *
     * @param coreTypes
     * @param fieldsJson
     * @param customConfiguration
     * @param nonExtendableTypes
     * @param commonFields
     */
    export function preprocess1(coreTypes: any,
                                fieldsJson: any,
                                customConfiguration: any,
                                nonExtendableTypes: any,
                                commonFields: any) {

        // to be done before applyCustomFields so that extra types can get additional fields too
        addExtraTypes(coreTypes, fieldsJson);
        const appConfiguration = { types: coreTypes } as UnorderedConfigurationDefinition;
        applyCustom(appConfiguration, customConfiguration, nonExtendableTypes);
        replaceCommonFields(appConfiguration, commonFields);
        return appConfiguration;
    }


    export function preprocess2(appConfiguration: any,
                                languageConfiguration: any,
                                customLanguageConfiguration: any,
                                searchConfiguration: any,
                                valuelistsConfiguration: any,
                                orderConfiguration: any,
                                hiddenConfiguration: any,
                                customHiddenConfiguration: any,
                                extraFields: any,
                                relations: any,
                                defaultFields: any) {

        hideFields(appConfiguration, hiddenConfiguration);
        hideFields(appConfiguration, customHiddenConfiguration);

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



    export function replaceCommonFields(configuration: UnorderedConfigurationDefinition, commonFields: any) {

        if (!configuration.types) return;

        for (let confTypeName of Object.keys(configuration.types)) {
            if ((configuration.types[confTypeName] as any)['commons']) {
                for (let commonFieldName of ((configuration.types[confTypeName] as any)['commons'])) {
                    if (!(configuration.types[confTypeName] as any)['fields']) {
                        (configuration.types[confTypeName] as any)['fields'] = {};
                    }
                    (configuration.types[confTypeName] as any)['fields'][commonFieldName]
                        = clone(commonFields[commonFieldName]);

                    //console.log(commonFields[commonFieldName])
                }

                delete (configuration.types[confTypeName] as any)['commons'];
            }
        }
    }


    export function applyCustom(appConfiguration: UnorderedConfigurationDefinition,
                                customConfiguration: any,
                                nonExtendableTypes: string[]) {

        // Validate first, before copying the types defined only in customConfiguration into the appConfiguration,
        // in order to make sure that only parents from the original appConfiguration can be referenced
        validateCustom(appConfiguration, customConfiguration, nonExtendableTypes);

        Object.keys(customConfiguration).forEach(typeName => {

            if (appConfiguration.types[typeName]) {
                addCustomFields(appConfiguration, typeName, customConfiguration[typeName].fields);
                addCustomCommons(appConfiguration, typeName, (customConfiguration[typeName] as any)['commons'])
            } else {
                appConfiguration.types[typeName] = customConfiguration[typeName];
            }
        });
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
            forEach((fd: FieldDefinition) => (fd as any)['valuelist'] = valuelistsConfiguration[(fd as any)['valuelistId']].values));

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
                .forEach(relation => {
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


    function merge(target: any, source: any) {

        for (let sourceFieldName of Object.keys(source)) {
            if (sourceFieldName === 'fields') continue;

            let alreadyPresentInTarget = false;

            for (let targetFieldName of Object.keys(target)) {
                if (targetFieldName === sourceFieldName) alreadyPresentInTarget = true;
            }

            if (!alreadyPresentInTarget) {
                target[sourceFieldName] = source[sourceFieldName];
            } else {
                // TODO hack
                if (source[sourceFieldName]['group']) {
                    target[sourceFieldName]['group'] = source[sourceFieldName]['group'];
                }
            }
        }
    }


    export function addExtraTypes(coreTypes: {[typeName: string]: TypeDefinition },
                                  configuration: UnorderedConfigurationDefinition) {

        for (let confTypeName of Object.keys(configuration.types)) {
            const confType = configuration.types[confTypeName];
            let typeAlreadyPresent = false;

            for (let coreTypeName of Object.keys(coreTypes)) {
                const coreType = coreTypes[coreTypeName];

                if (coreTypeName === confTypeName) {
                    typeAlreadyPresent = true;
                    merge(confType, coreType);
                    merge(confType.fields, coreType.fields);
                }
            }

            if (!typeAlreadyPresent) coreTypes[confTypeName] = confType;
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


    function addCustomFields(configuration: UnorderedConfigurationDefinition,
                             typeName: string,
                             fields: any) {

        if (!fields) return;

        Object.keys(fields).forEach(fieldName => {
            const field: any = { name: fieldName };
            Object.assign(field, fields[fieldName]);

            const group: string|undefined = configuration.types[typeName].fields[fieldName]
                ? configuration.types[typeName].fields[fieldName]['group']
                : undefined;

            if (fieldName === 'period') {
                console.log("fieldName", fieldName)
                console.log("gruo", group)
            }

            configuration.types[typeName].fields[fieldName] = field;

            // TODO hack; there are some fields we want to 'merge' in general
            if (group) configuration.types[typeName].fields[fieldName]['group'] = group;
        });
    }


    function addCustomCommons(configuration: UnorderedConfigurationDefinition, typeName: string,
                              commons: string[]|undefined) {

        if (!commons) return;

        if (!(configuration.types[typeName] as any)['commons']) {
            (configuration.types[typeName] as any)['commons'] = commons;
        } else {
            (configuration.types[typeName] as any)['commons']
                = (configuration.types[typeName] as any)['commons'].concat(commons);
        }
    }


    function validateCustom(appConfiguration: UnorderedConfigurationDefinition,
                            customConfiguration: any,
                            nonExtendableTypes: string[]) {

        Object.keys(customConfiguration).forEach(typeName => {
            if (!appConfiguration.types[typeName]) {
                if (!customConfiguration[typeName].parent) throw ConfigurationErrors.INVALID_CONFIG_NO_PARENT_ASSIGNED;

                const found = Object.keys(appConfiguration.types).find(is(customConfiguration[typeName].parent));
                if (!found) throw ConfigurationErrors.INVALID_CONFIG_PARENT_NOT_DEFINED;

                if (nonExtendableTypes.includes(customConfiguration[typeName].parent)) {
                    throw ConfigurationErrors.NOT_AN_EXTENDABLE_TYPE;
                }

                if (appConfiguration.types[customConfiguration[typeName].parent].parent) {
                    throw ConfigurationErrors.INVALID_CONFIG_PARENT_NOT_TOP_LEVEL;
                }
            }
        });
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


    function hideFields(appConfiguration: any, hiddenConfiguration: any) {

        if (!appConfiguration.types) return;

        Object.keys(hiddenConfiguration).forEach(typeName => {
            const type: TypeDefinition|undefined = appConfiguration.types[typeName];
            if (!type || !type.fields) return;

            hiddenConfiguration[typeName].forEach((fieldName: string) => {
                const field: FieldDefinition|undefined = type.fields[fieldName];
                if (field) {
                    field.visible = false;
                    field.editable = false;
                }
            });
        });
    }
}
