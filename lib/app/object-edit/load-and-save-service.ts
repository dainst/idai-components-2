import {Injectable} from "@angular/core";
import {MD} from "../core-services/md";
import {PersistenceManager} from "./persistence-manager";
import {Messages} from "../core-services/messages";
import {LoadAndSaveInterceptor} from "./load-and-save-interceptor"

/**
 * @author Daniel de Oliveira
 */
@Injectable()
export class LoadAndSaveService {

    constructor(
        private messages:Messages,
        private persistenceManager:PersistenceManager,
        private loadAndSaveInterceptor: LoadAndSaveInterceptor) {
    }

    public load(object) : Promise<any> {
        return new Promise((resolve,reject)=> {

            try {
                object=this.loadAndSaveInterceptor.interceptLoad(object);
            } catch (e) {
                this.messages.add(e);
                return reject();
            }

            this.persistenceManager.setOldVersion(object);
            resolve();
        })
    }

    public save(object) : Promise<any> {
        return new Promise((resolve,reject)=>{

            this.messages.clear();

            try {
                object=this.loadAndSaveInterceptor.interceptSave(object);
            } catch (e) {
                this.messages.add(e);
                return reject();
            } 
            
            this.persistenceManager.load(object);
            this.persistenceManager.persist().then(
                () => {
                    this.persistenceManager.setOldVersion(object);
                    this.messages.add(MD.OBJLIST_SAVE_SUCCESS);
                    resolve();
                },
                errors => {
                    if (errors) {
                        for (var i in errors) {
                            this.messages.add(errors[i]);
                        }
                    }
                    reject();
                }
            );
        });
    }
}
