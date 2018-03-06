import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {ProjectConfiguration} from './project-configuration';
import {MDInternal} from '../messages/md-internal';
import {ConfigurationPreprocessor} from './configuration-preprocessor';
import {ConfigurationValidator} from './configuration-validator';
import {PrePrepprocessConfigurationValidator} from './pre-prepprocess-configuration-validator';

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

    private processedAppConfiguration: Promise<ProjectConfiguration>|undefined = undefined;

    private resolveFunction: Function = () => {};

    private rejectFunction: Function = () => {};


    constructor(private http: Http) {

        this.processedAppConfiguration = new Promise<ProjectConfiguration>((resolve, reject) => {
            this.resolveFunction = resolve;
            this.rejectFunction = reject;
        });
    }


    /**
     * @returns resolves with the ProjectConfiguration or rejects with
     *   a msgWithParams.
     */
    public getProjectConfiguration = (): Promise<ProjectConfiguration>|undefined => this.processedAppConfiguration;


    public async go(
                appConfigurationPath: string,
                hiddenConfigurationPath: string|undefined,
                externallyConfiguredConfigurationPreprocessor: ConfigurationPreprocessor,
                postPreprocessConfigurationValidator: ConfigurationValidator) {

        let appConfiguration;
        try {
            appConfiguration = await this.read(this.http, appConfigurationPath);
        } catch (msgWithParams) {
            if (this.rejectFunction) return this.rejectFunction([msgWithParams]);
        }

        // PRE PREPROCESS VALIDATION

        const prePreprocessValidationErrors = PrePrepprocessConfigurationValidator.go(appConfiguration);
        if (prePreprocessValidationErrors.length > 0) {
            return this.rejectFunction(prePreprocessValidationErrors);
        }

        // PREPROCESS

        if (hiddenConfigurationPath) {

            let hiddenConfiguration;
            try {
                hiddenConfiguration = await this.read(this.http, hiddenConfigurationPath);
                if (hiddenConfiguration) ConfigLoader.hideFields(appConfiguration, hiddenConfiguration);
            } catch (_) {}
        }

        if (externallyConfiguredConfigurationPreprocessor) {
            externallyConfiguredConfigurationPreprocessor.go(appConfiguration);
        }
        new ConfigurationPreprocessor([], ConfigLoader.defaultFields, [])
            .go(appConfiguration);

        // POST PREPROCESS VALIDATION

        let configurationErrors: any = [];
        if (postPreprocessConfigurationValidator) configurationErrors = postPreprocessConfigurationValidator.go(appConfiguration);
        if (configurationErrors.length > 0) {
            this.rejectFunction(configurationErrors);
        } else {
            this.resolveFunction(new ProjectConfiguration(appConfiguration));
        }
    }


    private read(http: any, path: string): Promise<any> {

        return new Promise((resolve, reject) => {
            http.get(path).subscribe((data_: any) => {
                let data;
                try {
                    data = JSON.parse(data_['_body']);
                } catch(e) {
                    reject([MDInternal.PARSE_ERROR_INVALID_JSON, path]);
                }
                try {
                    resolve(data);
                } catch(e) {
                    console.log(e);
                }
            });
        });
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