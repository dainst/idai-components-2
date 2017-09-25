import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {ProjectConfiguration} from './project-configuration';
import {MDInternal} from '../messages/md-internal';
import {ConfigurationPreprocessor} from './configuration-preprocessor';
import {ConfigurationValidator} from './configuration-validator';

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
@Injectable()
export class ConfigLoader {

    private projectConfig: Promise<ProjectConfiguration> = undefined;
    private projectConfigResolveFunction: Function = undefined;
    private projectConfigRejectFunction: Function = undefined;

    constructor(private http: Http) {

        this._reset();
    }

    public reset() {

        this._reset();
    }

    /**
     * @returns resolves with the ProjectConfiguration or rejects with
     *   a msgWithParams.
     */
    public getProjectConfiguration(): Promise<ProjectConfiguration> {

        return this.projectConfig;
    }

    /**
     * @param projectConfigurationPath
     * @param configurationPreprocessor
     * @param configurationValidator
     */
    public go(projectConfigurationPath: string, configurationPreprocessor: ConfigurationPreprocessor,
              configurationValidator: ConfigurationValidator) {

        const defaultFields = [
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

        this.read(this.http, projectConfigurationPath).then(
            config => {
                if (configurationPreprocessor) configurationPreprocessor.go(config);
                new ConfigurationPreprocessor([], defaultFields, []).go(config);

                let configurationErrors = [];
                if (configurationValidator) configurationErrors = configurationValidator.go(config);
                if (configurationErrors.length > 0) {
                    this.projectConfigRejectFunction(configurationErrors);
                } else {
                    this.projectConfigResolveFunction(new ProjectConfiguration(config));
                }
            },
            msgWithParams => {
                this.projectConfigRejectFunction([msgWithParams]);
            }
        );
    }

    private read(http: any, path: string): Promise<any> {

        return new Promise((resolve, reject) => {
            http.get(path).subscribe(data_ => {
                let data;
                try {
                    data = JSON.parse(data_['_body']);
                } catch(e) {
                    reject([MDInternal.PARSE_ERROR_INVALID_JSON, path]);
                }
                // TODO Why is this try/catch block necessary?
                try {
                    resolve(data);
                } catch(e) {
                    console.log(e);
                }
            });
        });
    }

    private _reset() {

        this.projectConfig = new Promise<ProjectConfiguration>((resolve, reject) => {
            this.projectConfigResolveFunction = resolve;
            this.projectConfigRejectFunction = reject;
        });
    }
}