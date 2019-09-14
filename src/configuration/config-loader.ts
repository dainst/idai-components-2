import {Injectable} from '@angular/core';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {ProjectConfiguration} from './project-configuration';
import {Preprocessing, TypeDefinitions} from './preprocessing';
import {ConfigurationValidator} from './configuration-validator';
import {ConfigReader} from './config-reader';
import {TypeDefinition} from './type-definition';
import {RelationDefinition} from './relation-definition';
import {FieldDefinition} from './field-definition';
import {PrePreprocessConfigurationValidator} from './pre-preprocess-configuration-validator';
import {ConfigurationDefinition} from './configuration-definition';

const nonExtendableTypes: string[] = ['Operation', 'Place'];


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

    private defaultFields = {
        'id': {
            editable: false,
            visible: false
        } as FieldDefinition,
        'type': {
            label: this.i18n({ id: 'configuration.defaultFields.type', value: 'Typ' }),
            visible: false,
            editable: false
        } as FieldDefinition
    };


    constructor(private configReader: ConfigReader,
                private i18n: I18n) {}


    public async go(configDirPath: string,
                    commonFields: any,
                    extraTypes: {[typeName: string]: TypeDefinition },
                    relations: Array<RelationDefinition>,
                    extraFields: {[fieldName: string]: FieldDefinition },
                    prePreprocessConfigurationValidator: PrePreprocessConfigurationValidator,
                    postPreprocessConfigurationValidator: ConfigurationValidator,
                    customConfigurationName: string|undefined,
                    locale: string): Promise<ProjectConfiguration> {

        if (customConfigurationName) console.log('Load custom configuration', customConfigurationName);

        const typeDefinitions: TypeDefinitions = await this.readConfiguration(configDirPath);

        const prePreprocessValidationErrors = prePreprocessConfigurationValidator.go(typeDefinitions);
        if (prePreprocessValidationErrors.length > 0) throw prePreprocessValidationErrors;

        const appConfiguration = await this.preprocess(
            configDirPath, typeDefinitions, commonFields, extraTypes, relations,
            extraFields, customConfigurationName, locale);

        const postPreprocessValidationErrors = postPreprocessConfigurationValidator.go(appConfiguration);
        if (postPreprocessValidationErrors.length > 0) throw postPreprocessValidationErrors;

        return new ProjectConfiguration(appConfiguration);
    }


    private async readConfiguration(configDirPath: string): Promise<any> {

        const appConfigurationPath = configDirPath + '/Fields.json';

        try {
            return await this.configReader.read(appConfigurationPath);
        } catch (msgWithParams) {
            throw [[msgWithParams]];
        }
    }


    private async preprocess(configDirPath: string,
                             firstLevelTypes: TypeDefinitions,
                             commonFields: any,
                             coreTypes: {[typeName: string]: TypeDefinition },
                             relations: Array<RelationDefinition>,
                             extraFields: {[fieldName: string]: FieldDefinition },
                             customConfigurationName: string|undefined,
                             locale: string): Promise<ConfigurationDefinition> {

        const hiddenConfigurationPath = configDirPath + '/Hidden.json';
        const customHiddenConfigurationPath = configDirPath + '/Hidden-'
            + (customConfigurationName ? customConfigurationName : 'Custom') + '.json';
        const languageConfigurationPath = configDirPath + '/Language.' + locale + '.json';
        const orderConfigurationPath = configDirPath + '/Order.json';
        const searchConfigurationPath = configDirPath + '/Search.json';
        const valuelistsConfigurationPath = configDirPath + '/Valuelists.json';
        const customConfigPath = configDirPath
            + '/Fields-' + (customConfigurationName ? customConfigurationName : 'Custom') + '.json';

        let secondLevelTypes;
        let hiddenConfiguration: any;
        let customHiddenConfiguration: any;
        let languageConfiguration: any;
        let customLanguageConfiguration: any;
        let searchConfiguration: any;
        let valuelistsConfiguration: any;
        let orderConfiguration: any;

        try {
            secondLevelTypes = await this.configReader.read(customConfigPath);
            hiddenConfiguration = await this.configReader.read(hiddenConfigurationPath);
            customHiddenConfiguration = await this.configReader.read(customHiddenConfigurationPath);
            languageConfiguration = await this.configReader.read(languageConfigurationPath);
            customLanguageConfiguration = await this.configReader.read(configDirPath + '/Language-'
                + (customConfigurationName
                    ? customConfigurationName
                    : 'Custom')
                + '.' + locale + '.json');
            searchConfiguration = await this.configReader.read(searchConfigurationPath);
            valuelistsConfiguration = await this.configReader.read(valuelistsConfigurationPath);
            orderConfiguration = await this.configReader.read(orderConfigurationPath);
        } catch (msgWithParams) {
            throw [[msgWithParams]];
        }


        // unused: Preprocessing.prepareSameMainTypeResource(appConfiguration);
        // unused: Preprocessing.setIsRecordedInVisibilities(appConfiguration); See #8992

        let typeDefs: any;
        try {
            typeDefs = Preprocessing.mergeTypes(
                coreTypes,
                firstLevelTypes,
                secondLevelTypes,
                nonExtendableTypes,
                commonFields);
        } catch (msgWithParams) {
            throw [msgWithParams];
        }

        try {
            return Preprocessing.preprocess2(
                { types: typeDefs },
                languageConfiguration,
                customLanguageConfiguration,
                searchConfiguration,
                valuelistsConfiguration,
                orderConfiguration,
                hiddenConfiguration,
                customHiddenConfiguration,
                extraFields,
                relations,
                this.defaultFields);

        } catch (msgWithParams) {
            throw [[msgWithParams]];
        }
    }
}