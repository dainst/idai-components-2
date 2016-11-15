import {Injectable} from "@angular/core";
import {ProjectConfiguration} from "./project-configuration";
import {Http} from "@angular/http";
import {MDInternal} from "../messages/md-internal";
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

    private error = undefined;

    constructor(
        private http: Http){
    }


    private notify() {
        if (!this.projectConfig && !this.error) return;
        this.observers.forEach(observer => {
            observer.next({
                projectConfiguration: this.projectConfig,
                error: this.error
            });
        });
    }

    /**
     * When the config file has been read, a subscriber is
     * notified with an object containing further objects for 
     * each configuration or an error report in case errors 
     * occured during the reading process.
     * 
     * It is recommended that clients, who have multiple places
     * where the configs are needed, still have exactly one common 
     * place in their app where the errors get handled.
     * 
     * @returns {Observable<any>} the result, containing configs or errors.
     */
    public configuration() : Observable<any> {
        return Observable.create( observer => {
            this.observers.push(observer);
            this.notify();
        });
    }

    /**
     *
     * @param projectConfigurationPath
     */
    public setConfigurationPath (projectConfigurationPath: string) {
        this.read(this.http,projectConfigurationPath).then(
            (config)=>{
                this.projectConfig = new ProjectConfiguration(config);
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