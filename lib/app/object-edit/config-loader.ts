import {Injectable} from "@angular/core";
import {ProjectConfiguration} from "./project-configuration";
import {RelationsConfiguration} from "./relations-configuration";
import {Http} from "@angular/http";
import {MD} from "../core-services/md";


/**
 * @author Daniel de Oliveira
 */
@Injectable()
export class ConfigLoader {

   

    constructor(
        private http: Http){
    }

    /**
     * @returns {Promise<ProjectConfiguration>} which gets rejected with a key of MD or an error msg in case of an error.
     */
    public getProjectConfiguration(path:string) : Promise<ProjectConfiguration> {

        return new Promise<ProjectConfiguration>((resolve, reject) => {
            this.read(path,resolve,reject,function(data){
                return new ProjectConfiguration(data);
            })
        });
    }
    
    /**
     * @returns {Promise<RelationsConfiguration>} which gets rejected with a key of MD or an error msg in case of an error.
     */
    public getRelationsConfiguration(path:string) : Promise<RelationsConfiguration> {

        return new Promise<RelationsConfiguration>((resolve, reject) => {
            this.read(path,resolve,reject,function(data){
                return new RelationsConfiguration(data['relations']);
            })
        });
    }

    private read(path:string,resolve,reject,createMethod) {
        this.http.get(path).
        subscribe(data_=>{

            var data;
            try {
                data=JSON.parse(data_['_body'])
            } catch (e) {
                reject(MD.PARSE_GENERIC_ERROR);
            }

            try {
                resolve(createMethod(data))
            } catch (e) {
                reject(e)
            }
        });
    }
}