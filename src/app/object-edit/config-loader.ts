import {Injectable} from "@angular/core";
import {ProjectConfiguration} from "./project-configuration";
import {RelationsConfiguration} from "./relations-configuration";
import {Http} from "@angular/http";
import {MDInternal} from "../core-services/md-internal";
import {Observable} from "rxjs/Observable";

/**
 * Lets clients subscribe for the app
 * configuration. In order for this to work, they
 * have to subscribe via the <code>configuration</code>
 * as well as setting the config paths via
 * <code>setConfigurationPaths</code>.
 *
 * The code is purposely designed that the order in which
 * you call these methods does not matter. 
 *
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 * @author Fabian Z.
 */
@Injectable()
export class ConfigLoader {

    private observers = [];

    private projectConfig: ProjectConfiguration = undefined;
    private relationsConfig: RelationsConfiguration = undefined;

    private error = undefined;

    constructor(
        private http: Http){
    }


    private notify() {
        if (!this.relationsConfig && !this.projectConfig && !this.error) return;
        this.observers.forEach(observer => {
            observer.next({
                projectConfiguration: this.projectConfig,
                relationsConfiguration: this.relationsConfig,
                error: this.error
            });
        });
    }

    /**
     * When all config files have been read, a subscriber is
     * notified with an object containing further objects for 
     * each configuration or an error report in case errors 
     * occured during the reading process.
     * 
     * @returns {any}
     */
    public configuration() {
        return Observable.create( observer => {
            this.observers.push(observer);
            this.notify();
        });
    }

    /**
     *
     * @param projectConfigurationPath
     * @param relationsConfigurationPath
     */
    public setConfigurationPaths (projectConfigurationPath: string, relationsConfigurationPath: string) {
        var ps=[];
        ps.push(this.read(this.http,projectConfigurationPath, "project"));
        ps.push(this.read(this.http,relationsConfigurationPath, "relations"));

        Promise.all(ps).then(
            (configs)=>{
                for (var config of configs) {
                    if (config.configType == "relations") {
                        this.relationsConfig = new RelationsConfiguration(config.data['relations']);
                    } else {
                        this.projectConfig = new ProjectConfiguration(config.data);
                    }
                }
                this.notify();
            },
            (error) => {
                console.error(error['path'], error);
                this.error = {
                    msgkey: MDInternal.PARSE_GENERIC_ERROR,
                    msgparams: error['path']
                };
                this.notify();
            }
        );
    }

    private read(http:any, path:string, configType:string): Promise<any> {
        return new Promise(function(resolve,reject) {
            http.get(path).subscribe(data_=> {
                var data;
                try {
                    data = JSON.parse(data_['_body']);
                } catch (e) {
                    e['path'] = path;
                    reject(e);
                }
                try {
                    resolve({
                        data: data,
                        configType: configType
                    });
                } catch (e) {
                    console.log(e);
                }
            });
        });
    }
}