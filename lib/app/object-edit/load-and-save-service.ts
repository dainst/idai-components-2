import {Injectable} from "@angular/core";
import {MD} from "../core-services/md";
import {PersistenceManager} from "./persistence-manager";
import {Messages} from "../core-services/messages";
import {ValidationInterceptor} from "./validation-interceptor"

/**
 * The purpose of this is to have a place
 * for the calls to setOldVersion, to validate,
 * and to convert errors to messages.
 *
 * @author Daniel de Oliveira
 */
@Injectable()
export class LoadAndSaveService {

    constructor(
        private messages:Messages,
        private persistenceManager:PersistenceManager,
        private loadAndSaveInterceptor: ValidationInterceptor) {
    }

    public load(document) : Promise<any> {
        return new Promise((resolve,reject)=> {

            this.persistenceManager.setOldVersion(document);
            resolve();
        })
    }

    public save(document) : Promise<any> {
        return new Promise((resolve,reject)=>{

            this.messages.clear();

            var result=this.loadAndSaveInterceptor.validate(document);
            if (result!=undefined) {
                this.messages.add(result);
                return reject();
            } 
            
            this.persistenceManager.load(document);
            this.persistenceManager.persist().then(
                () => {
                    this.persistenceManager.setOldVersion(document);
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
