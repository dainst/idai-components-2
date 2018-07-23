import {Injectable} from '@angular/core';
import {ProjectConfiguration} from './project-configuration';
import {Preprocessing} from './preprocessing';
import {ConfigurationValidator} from './configuration-validator';
import {ConfigReader} from './config-reader';
import {TypeDefinition} from './type-definition';
import {RelationDefinition} from './relation-definition';
import {FieldDefinition} from './field-definition';
import {
    IdaiFieldPrePreprocessConfigurationValidator
} from './idai-field-pre-preprocess-configuration-validator';
import {UnorderedConfigurationDefinition} from './unordered-configuration-definition';
import {ConfigurationDefinition} from './configuration-definition';

@Injectable()
/**
 * Lets clients subscribe for the app
 * configuration. In order for this to work, they
 * have to call <code>go</code> and <code>getProjectConfiguration</code>
 *  (the call order does not matter).
 *
 * It is recommended to handle a promise rejection of
 * <code>getProjectConfiguration</code> at a single place in your app.
 *
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 * @author Fabian Z.
 */
export class ConfigLoader {

    private static defaultFields = {
        'id': {
            editable: false,
            visible: false
        } as FieldDefinition,
        'type': {
            label: 'Typ',
            visible: false,
            editable: false
        } as FieldDefinition
    };


    constructor(private configReader: ConfigReader) {}


    public async go(
                configDirPath: string,
                extraTypes: {[typeName: string]: TypeDefinition },
                extraRelations: Array<RelationDefinition>,
                extraFields: {[fieldName: string]: FieldDefinition },
                extraFieldsOrder: string[],
                prePreprocessConfigurationValidator: IdaiFieldPrePreprocessConfigurationValidator,
                postPreprocessConfigurationValidator: ConfigurationValidator,
                applyMeninxConfiguration: boolean = false): Promise<ProjectConfiguration> {

        let appConfiguration: any = await this.readConfiguration(configDirPath);

        const prePreprocessValidationErrors = prePreprocessConfigurationValidator.go(appConfiguration);
        if (prePreprocessValidationErrors.length > 0) throw prePreprocessValidationErrors;

        appConfiguration = await this.preprocess(configDirPath, appConfiguration, extraTypes, extraRelations,
            extraFields, extraFieldsOrder, applyMeninxConfiguration);

        const postPreprocessValidationErrors = postPreprocessConfigurationValidator.go(appConfiguration);
        if (postPreprocessValidationErrors.length > 0) throw postPreprocessValidationErrors;

        return new ProjectConfiguration(appConfiguration);
    }


    private async readConfiguration(configDirPath: string): Promise<any> {

        const appConfigurationPath = configDirPath + '/Configuration.json';

        try {
            return await this.configReader.read(appConfigurationPath);
        } catch (msgWithParams) {
            throw [[msgWithParams]];
        }
    }


    private async preprocess(configDirPath: string, appConfiguration: any,
                             extraTypes: {[typeName: string]: TypeDefinition } ,
                             extraRelations: Array<RelationDefinition>,
                             extraFields: {[fieldName: string]: FieldDefinition },
                             extraFieldsOrder: string[],
                             applyMeninxConfiguration: boolean): Promise<ConfigurationDefinition> {

        const customFieldsConfigurationPath = configDirPath + '/Fields-Custom.json';
        const meninxFieldsConfigurationPath = configDirPath + '/Fields-Meninx.json';
        const hiddenConfigurationPath = configDirPath + '/Hidden.json';
        const customHiddenConfigurationPath = configDirPath + '/Hidden-Custom.json';
        const languageConfigurationPath = configDirPath + '/Language.json';
        const customLanguageConfigurationPath = configDirPath + '/Language-Custom.json';
        const meninxLanguageConfigurationPath = configDirPath + '/Language-Meninx.json';
        const orderConfigurationPath = configDirPath + '/Order.json';
        const searchConfigurationPath = configDirPath + '/Search.json';
        const datingConfigurationPath = configDirPath + '/Periods.json';
        const meninxDatingConfigurationPath = configDirPath + '/Dating-Meninx.json';

        Preprocessing.prepareSameMainTypeResource(appConfiguration);
        Preprocessing.setIsRecordedInVisibilities(appConfiguration); // TODO rename and test / also: it is idai field specific

        await this.applyCustomFieldsConfiguration(appConfiguration,
            applyMeninxConfiguration ?
                meninxFieldsConfigurationPath :
                customFieldsConfigurationPath
        );

        await this.applyHiddenConfs(appConfiguration, hiddenConfigurationPath, customHiddenConfigurationPath);

        if (!appConfiguration.relations) appConfiguration.relations = [];
        Preprocessing.addExtraTypes(appConfiguration, extraTypes);
        Preprocessing.addExtraFields(appConfiguration, extraFields);
        Preprocessing.addExtraRelations(appConfiguration, extraRelations);
        Preprocessing.addExtraFields(appConfiguration, ConfigLoader.defaultFields);

        await this.applyLanguageConfs(appConfiguration, languageConfigurationPath,
            applyMeninxConfiguration ?
                meninxLanguageConfigurationPath :
                customLanguageConfigurationPath
        );

        await this.applySearchConfiguration(appConfiguration, searchConfigurationPath);
        await this.applyDatingConfiguration(appConfiguration,
            applyMeninxConfiguration
                ? meninxDatingConfigurationPath
                : datingConfigurationPath
        );

        return this.getOrderedConfiguration(appConfiguration, orderConfigurationPath, extraFieldsOrder);

    }


    private async applyCustomFieldsConfiguration(appConfiguration: any,
                                                 customFieldsConfigurationPath: string) {

        try {
            const customConfiguration = await this.configReader.read(customFieldsConfigurationPath);
            Object.keys(customConfiguration).forEach(typeName => {
                Preprocessing.addCustomFields(appConfiguration, typeName,
                    customConfiguration[typeName].fields);
            });
        } catch (msgWithParams) {
            throw [[msgWithParams]];
        }
    }


    private async applyLanguageConfs(appConfiguration: any, languageConfigurationPath: string,
                                     customLanguageConfigurationPath: string) {

        try {
            const languageConfiguration = await this.configReader.read(languageConfigurationPath);
            Preprocessing.applyLanguage(appConfiguration, languageConfiguration); // TODO test it
        } catch (msgWithParams) {
            throw [[msgWithParams]];
        }

        try {
            const customLanguageConfiguration = await this.configReader.read(customLanguageConfigurationPath);
            Preprocessing.applyLanguage(appConfiguration, customLanguageConfiguration); // TODO test it
        } catch (msgWithParams) {
            throw [[msgWithParams]];
        }
    }


    private async applySearchConfiguration(appConfiguration: any, searchConfigurationPath: string) {

        try {
            const searchConfiguration = await this.configReader.read(searchConfigurationPath);
            Preprocessing.applySearchConfiguration(appConfiguration, searchConfiguration);
        }  catch (msgWithParams) {
            throw [[msgWithParams]];
        }
    }


    private async applyDatingConfiguration(appConfiguration: any, datingConfigurationPath: string) {

        try {
            const datingConfiguration = await this.configReader.read(datingConfigurationPath);
            Preprocessing.applyDatingConfiguration(appConfiguration, datingConfiguration);
        }  catch (msgWithParams) {
            throw [[msgWithParams]];
        }
    }


    private async applyHiddenConfs(appConfiguration: any, hiddenConfigurationPath: string,
                                   customHiddenConfigurationPath: string) {

        try {
            const hiddenConfiguration = await this.configReader.read(hiddenConfigurationPath);
            ConfigLoader.hideFields(appConfiguration, hiddenConfiguration);
        } catch (_) {}

        try {
            const customHiddenConfiguration = await this.configReader.read(customHiddenConfigurationPath);
            ConfigLoader.hideFields(appConfiguration, customHiddenConfiguration);
        } catch (_) {}
    }


    private async getOrderedConfiguration(appConfiguration: UnorderedConfigurationDefinition,
                                          orderConfigurationPath: string,
                                          extraFieldsOrder: string[]): Promise<ConfigurationDefinition> {

        let orderedConfiguration: ConfigurationDefinition;

        try {
            const orderConfiguration = await this.configReader.read(orderConfigurationPath);
            ConfigLoader.addExtraFieldsOrder(appConfiguration, orderConfiguration, extraFieldsOrder);

            orderedConfiguration = {
                identifier: appConfiguration.identifier,
                relations: appConfiguration.relations,
                types: ConfigLoader.getOrderedTypes(appConfiguration, orderConfiguration)
            };

        } catch (msgWithParams) {
            throw [[msgWithParams]];
        }

        return orderedConfiguration;
    }


    private static addExtraFieldsOrder(appConfiguration: UnorderedConfigurationDefinition,
                                       orderConfiguration: any, extraFieldsOrder: string[]) {

        if (!orderConfiguration.fields) orderConfiguration.fields = {};

        Object.keys(appConfiguration.types).forEach(typeName => {
            if (!orderConfiguration.fields[typeName]) orderConfiguration.fields[typeName] = [];
            orderConfiguration.fields[typeName]
                = extraFieldsOrder.concat(orderConfiguration.fields[typeName]);
        });
    }


    private static getOrderedTypes(appConfiguration: UnorderedConfigurationDefinition,
                                   orderConfiguration: any): Array<TypeDefinition> {

        const types: Array<TypeDefinition> = [];

        if (orderConfiguration.types) {
            orderConfiguration.types.forEach((typeName: string) => {
                const type: TypeDefinition | undefined = appConfiguration.types[typeName];
                if (type) this.addToOrderedTypes(type, typeName, types, orderConfiguration);
            });
        }

        Object.keys(appConfiguration.types).forEach(typeName => {
            if (!types.find(type => type.type === typeName)) {
                this.addToOrderedTypes(appConfiguration.types[typeName], typeName, types, orderConfiguration);
            }
        });

        return types;
    }


    private static addToOrderedTypes(type: TypeDefinition, typeName: string, types: Array<TypeDefinition>,
                                     orderConfiguration: any) {

        if (types.includes(type)) return;

        type.type = typeName;
        type.fields = this.getOrderedFields(type, orderConfiguration);
        types.push(type);
    }


    private static getOrderedFields(type: TypeDefinition, orderConfiguration: any): Array<FieldDefinition> {

        const fields: Array<FieldDefinition> = [];

        if (!type.fields) return fields;

        if (orderConfiguration.fields[type.type]) {
            orderConfiguration.fields[type.type].forEach((fieldName: string) => {
                const field: FieldDefinition | undefined = type.fields[fieldName];
                if (field) this.addToOrderedFields(field, fieldName, fields);
            });
        }

        Object.keys(type.fields).forEach(fieldName => {
            if (!fields.find(field => field.name === fieldName)) {
                this.addToOrderedFields(type.fields[fieldName], fieldName, fields);
            }
        });

        return fields;
    }


    private static addToOrderedFields(field: FieldDefinition, fieldName: string,
                                      fields: Array<FieldDefinition>) {

        if (fields.includes(field)) return;

        field.name = fieldName;
        fields.push(field);
    }


    private static hideFields(appConfiguration: any, hiddenConfiguration: any) {

        if (appConfiguration.types) {
            for (let type of Object.keys(hiddenConfiguration)) {
                for (let fieldToHide of hiddenConfiguration[type]) {

                    for (let i in appConfiguration.types) {

                        if (appConfiguration.types[i].type === type && appConfiguration.types[i].fields) {

                            for (let j in appConfiguration.types[i].fields) {

                                if (appConfiguration.types[i].fields[j].name === fieldToHide) {

                                    appConfiguration.types[i].fields[j].visible = false;
                                    appConfiguration.types[i].fields[j].editable = false;
                                }
                            }
                        }
                    }

                }
            }
        }
    }
}