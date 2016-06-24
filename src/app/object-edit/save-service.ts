import {Injectable} from "@angular/core";
import {PersistenceManager} from "./persistence-manager";
import {ValidationInterceptor} from "./validation-interceptor"
import {Document} from "../core-services/document";

/**
 * Facade with high level functions for document management
 * to be used by clients of the library.
 *
 * Implementation note: It handles 
 * <li>setting the old version
 * <li>calling the validation hook
 * <li>managing the changed state
 * 
 * 
 * @author Daniel de Oliveira
 */
@Injectable()
export class SaveService {

    private changed = false;
    
    constructor(
        private persistenceManager:PersistenceManager,
        private loadAndSaveInterceptor: ValidationInterceptor) {
    }

    public isChanged() {
        return this.changed;
    }

    public setChanged(value:boolean=true) {
        this.changed=value;
    }

    /**
     * 
     * @param document
     * @returns {Promise<T>} 
     *   resolve -> ()
     *   reject -> error messages or keys
     */
    public save(document:Document) : Promise<any> {
        return new Promise((resolve,reject)=>{

            var result=this.loadAndSaveInterceptor.validate(document);
            if (result!=undefined) 
                return reject(result);
            
            
            this.setChanged();
            this.persistenceManager.persist(document).then(
                () => {
                    this.persistenceManager.setOldVersion(document);
                    this.changed=false;
                    resolve();
                },
                errors => {
                    reject(errors);
                }
            );
        });
    }
}
