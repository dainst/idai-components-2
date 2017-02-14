import {Injectable} from "@angular/core";
import {ProjectConfiguration} from "./project-configuration";
import {Http} from "@angular/http";
import {MDInternal} from "../messages/md-internal";
import {ConfigurationPreprocessor} from "./configuration-preprocessor";
import {ConfigurationValidator} from "./configuration-validator";

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

    private projectConfig: Promise<ProjectConfiguration> = undefined;
    private projectConfigResolveFunction = undefined;
    private projectConfigRejectFunction = undefined;

    constructor(
        private http: Http){

        this.projectConfig = new Promise<ProjectConfiguration>((resolve,reject)=>{
           this.projectConfigResolveFunction = resolve;
           this.projectConfigRejectFunction = reject;
        });
    }

    /**
     * @returns resolves with the ProjectConfiguration or rejects with
     *   a msgWithParams.
     */
    public getProjectConfiguration() : Promise<ProjectConfiguration> {
        return this.projectConfig;
    }

    /**
     * @param projectConfigurationPath
     * @param defaultTypes
     * @param defaultFields
     * @param namesOfMandatoryTypes
     */
    public go(
        projectConfigurationPath: string,
        configurationPreprocessor: ConfigurationPreprocessor,
        configurationValidator: ConfigurationValidator
    ) {
        var defaultFields = [
            {
                name : "id",
                editable : false,
                visible : false
            },
            {
                name : "type",
                visible : false,
                editable : false
            }
        ];

        this.read(this.http,projectConfigurationPath).then(
            config => {
                if (configurationPreprocessor) configurationPreprocessor.go(config);
                new ConfigurationPreprocessor([],defaultFields,[]).go(config);

                var configurationError = undefined;
                if (configurationValidator) configurationError =
                    configurationValidator.go(config);
                if (configurationError) {
                    this.projectConfigRejectFunction(configurationError);
                } else {
                    this.projectConfigResolveFunction(new ProjectConfiguration(config));
                }
            },
            error => {
                this.projectConfigRejectFunction(
                    [MDInternal.PARSE_GENERIC_ERROR].concat([error['path']])
                );
            }
        );
    }

    private read(http:any, path:string): Promise<any> {
        return new Promise(function(resolve, reject) {
            http.get(path).subscribe(data_=> {
                var data;
                try {
                    data = JSON.parse(data_['_body']);
                } catch (e) {
                    e['path'] = path;
                    reject(e);
                }
                try {
                    resolve(data);
                } catch (e) {
                    console.log(e);
                }
            });
        });
    }
}