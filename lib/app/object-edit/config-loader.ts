import {Injectable} from "@angular/core";
import {ProjectConfiguration} from "./project-configuration";
import {RelationsConfiguration} from "./relations-configuration";
import {Http} from "@angular/http";
import {MD} from "../core-services/md";
import {Observable} from "rxjs/Observable";

/**
 * @author Daniel de Oliveira
 */
@Injectable()
export class ConfigLoader {
    
    private projectConfigurationObservers = [];
    private relationsConfigurationObservers = [];

    constructor(
        private http: Http){
    }

    /**
     * @returns {Promise<ProjectConfiguration>} which gets rejected with a key of MD or an error msg in case of an error.
     */
    public projectConfiguration() : Observable<ProjectConfiguration> {
        return Observable.create( observer => {
            this.projectConfigurationObservers.push(observer);
        });
    }

    public relationsConfiguration() : Observable<RelationsConfiguration> {
        return Observable.create( observer => {
            this.relationsConfigurationObservers.push(observer);
        });
    }
    
    public setProjectConfiguration(path:string) {
        this.read(path,this,function(data,self){
            self.relationsConfigurationObservers.forEach(observer =>
                observer.next(new ProjectConfiguration(data)));
        })
    }
    
    public setRelationsConfiguration(path:string) {
        this.read(path,this,function(data,self){
            self.relationsConfigurationObservers.forEach(observer =>
                observer.next(new RelationsConfiguration(data['relations'])));
        })
    }
    
    
    private read(path:string,self,createMethod) {
        this.http.get(path).
        subscribe(data_=>{

            var data;
            try {
                data=JSON.parse(data_['_body'])
            } catch (e) {
                console.error(MD.PARSE_GENERIC_ERROR);
            }
            try {
                createMethod(data,self)
            } catch (e) {
                console.error(e)
            }
        });
    }
}