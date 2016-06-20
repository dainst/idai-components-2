import {Injectable} from "@angular/core";
import {MD} from "../core-services/md";
import {PersistenceManager} from "./persistence-manager";
import {Messages} from "../core-services/messages";
import {ValidationInterceptor} from "./validation-interceptor"

/**
 * Facade with high level functions for document management
 * to be used by clients of the library.
 *
 * @author Daniel de Oliveira
 */
@Injectable()
//
// The purpose of this was originally to have a place
// for the calls to setOldVersion, to validate,
// and to convert errors to messages.
//
// The reason for error messages to be send to the message service
// from within this class and not making them params of reject is that
// there are calls to "save" from within the library as well. See
// the "Speichern" Button.
//
export class LoadAndSaveService {

    private changed = true;
    
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

    public isChanged() {
        return this.changed;
    }

    // package private
    setChanged() {
        this.changed=true;
    }
    
    public save(document) : Promise<any> {
        return new Promise((resolve,reject)=>{

            this.messages.clear();

            var result=this.loadAndSaveInterceptor.validate(document);
            if (result!=undefined) {
                this.messages.add(result);
                return reject();
            } 
            
            this.setChanged();
            this.persistenceManager.persist(document).then(
                () => {
                    this.persistenceManager.setOldVersion(document);
                    this.messages.add(MD.OBJLIST_SAVE_SUCCESS);
                    this.changed=false;
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
