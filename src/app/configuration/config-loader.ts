import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {ProjectConfiguration} from './project-configuration';
import {MDInternal} from '../messages/md-internal';
import {ConfigurationPreprocessor} from './configuration-preprocessor';
import {ConfigurationValidator} from './configuration-validator';

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

    private projectConfig: Promise<ProjectConfiguration>|undefined = undefined;
    private projectConfigResolveFunction: Function|undefined = undefined;
    private projectConfigRejectFunction: Function|undefined = undefined;


    constructor(private http: Http) {

        this.projectConfig = new Promise<ProjectConfiguration>((resolve, reject) => {
            this.projectConfigResolveFunction = resolve;
            this.projectConfigRejectFunction = reject;
        });
    }


    /**
     * @returns resolves with the ProjectConfiguration or rejects with
     *   a msgWithParams.
     */
    public getProjectConfiguration(): Promise<ProjectConfiguration>|undefined {

        return this.projectConfig;
    }

    /**
     * @param projectConfigurationPath
     * @param configurationPreprocessor
     * @param configurationValidator
     */
    public async go(projectConfigurationPath: string, configurationPreprocessor: ConfigurationPreprocessor,
              configurationValidator: ConfigurationValidator) {

        let config;
        try {
            config = await this.read(this.http, projectConfigurationPath);
        } catch (msgWithParams) {
            if (this.projectConfigRejectFunction) return this.projectConfigRejectFunction([msgWithParams]);
        }

        if (configurationPreprocessor) configurationPreprocessor.go(config);
        new ConfigurationPreprocessor([], ConfigLoader.defaultFields, []).go(config);

        let configurationErrors: any = [];
        if (configurationValidator) configurationErrors = configurationValidator.go(config);
        if (configurationErrors.length > 0) {
            if (this.projectConfigRejectFunction) this.projectConfigRejectFunction(configurationErrors);
        } else {
            if (this.projectConfigResolveFunction) this.projectConfigResolveFunction(new ProjectConfiguration(config));
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
                // TODO Why is this try/catch block necessary?
                try {
                    resolve(data);
                } catch(e) {
                    console.log(e);
                }
            });
        });
    }
}