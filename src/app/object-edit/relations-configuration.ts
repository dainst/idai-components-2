import {Injectable} from "@angular/core";

/**
 * 
 */
@Injectable()
export class RelationsConfiguration {
    
    constructor(private relationFields:any[]) {}
    

    public getRelationFields() {
        return this.relationFields;
    }

    public getInverse(prop) {
        for (var p of this.relationFields) {
            if (p["field"]==prop) return p["inverse"];
        }
        return undefined;
    }

    public isRelationProperty(propertyName:string):boolean {
        for (var p of this.relationFields) {
            if (p["field"]==propertyName) return true;
        }
        return false;
    }
}