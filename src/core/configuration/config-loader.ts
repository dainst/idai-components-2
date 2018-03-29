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
} from './idai-field-pre-prepprocess-configuration-validator';

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

    private static defaultFields = [
        {
            name: 'id',
            editable: false,
            visible: false
        },
        {
            name: 'type',
            visible: false,
            editable: false
        }
    ];


    constructor(private configReader: ConfigReader) {}


    public async go(
                configDirPath: string,
                extraTypes : Array<TypeDefinition>,
                extraRelations : Array<RelationDefinition>,
                extraFields: Array<FieldDefinition>,
                prePreprocessConfigurationValidator: IdaiFieldPrePreprocessConfigurationValidator,
                postPreprocessConfigurationValidator: ConfigurationValidator): Promise<ProjectConfiguration> {

        const appConfigurationPath = configDirPath + "/Configuration.json";
        const hiddenConfigurationPath = configDirPath + "/Hidden.json";
        const customHiddenConfigurationPath = configDirPath + "/Hidden-Custom.json";
        const languageConfigurationPath = configDirPath + "/Language.json";
        const customLanguageConfigurationPath = configDirPath + "/Language-Custom.json";

        let appConfiguration;
        try {
            appConfiguration = await this.configReader.read(appConfigurationPath);
        } catch (msgWithParams) {
            throw [[msgWithParams]];
        }

        // PRE PREPROCESS VALIDATION

        const prePreprocessValidationErrors = prePreprocessConfigurationValidator.go(appConfiguration);
        if (prePreprocessValidationErrors.length > 0) throw prePreprocessValidationErrors;

        // PREPROCESS


        Preprocessing.prepareSameMainTypeResource(appConfiguration);
        Preprocessing.setIsRecordedInVisibilities(appConfiguration); // TODO rename and test / also: it is idai field specific

        await this.applyHiddenConfs(appConfiguration, hiddenConfigurationPath, customHiddenConfigurationPath);

        if (!appConfiguration.relations) appConfiguration.relations = [];
        Preprocessing.addExtraTypes(appConfiguration, extraTypes);
        Preprocessing.addExtraFields(appConfiguration, extraFields);
        Preprocessing.addExtraRelations(appConfiguration, extraRelations);
        Preprocessing.addExtraFields(appConfiguration, ConfigLoader.defaultFields);

        await this.applyLanguageConfs(appConfiguration, languageConfigurationPath, customLanguageConfigurationPath);

        // POST PREPROCESS VALIDATION

        let configurationErrors: any = [];
        if (postPreprocessConfigurationValidator) configurationErrors = postPreprocessConfigurationValidator.go(appConfiguration);

        if (configurationErrors.length > 0) {
            throw configurationErrors;
        } else {
            return new ProjectConfiguration(appConfiguration);
        }
    }


    private async applyLanguageConfs(appConfiguration: any, languageConfigurationPath: string, customLanguageConfigurationPath: string) {

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


    private async applyHiddenConfs(appConfiguration: any, hiddenConfigurationPath: string, customHiddenConfigurationPath: string) {

        try {
            const hiddenConfiguration = await this.configReader.read(hiddenConfigurationPath);
            ConfigLoader.hideFields(appConfiguration, hiddenConfiguration);
        } catch (_) {}

        try {
            const customHiddenConfiguration = await this.configReader.read(customHiddenConfigurationPath);
            ConfigLoader.hideFields(appConfiguration, customHiddenConfiguration);
        } catch (_) {}
    }


    private static hideFields(appConfiguration: any, hiddenConfiguration: any) {

        if (appConfiguration.types) {
            for (let type of Object.keys(hiddenConfiguration)) {
                for (let fieldToHide of hiddenConfiguration[type]) {

                    for (let i in appConfiguration.types) {

                        if (appConfiguration.types[i].type === type
                            && appConfiguration.types[i].fields) {

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