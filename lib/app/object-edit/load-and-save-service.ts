import {Injectable} from "@angular/core";
import {MD} from "../core-services/md";
import {PersistenceManager} from "./persistence-manager";
import {Messages} from "../core-services/messages";
import {ValidationInterceptor} from "./validation-interceptor"

/**
 * @author Daniel de Oliveira
 */
@Injectable()
export class LoadAndSaveService {

    constructor(
        private messages:Messages,
        private persistenceManager:PersistenceManager,
        private loadAndSaveInterceptor: ValidationInterceptor) {
    }

    public load(object) : Promise<any> {
        return new Promise((resolve,reject)=> {

            this.persistenceManager.setOldVersion(object);
            resolve();
        })
    }

    public save(object) : Promise<any> {
        return new Promise((resolve,reject)=>{

            this.messages.clear();

            var result=this.loadAndSaveInterceptor.validate(object);
            if (result!=undefined) {
                this.messages.add(result);
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
