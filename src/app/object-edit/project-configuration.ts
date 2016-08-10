import {Injectable} from "@angular/core";
import {MD} from "../core-services/md";

/**
 * ProjectConfiguration maintains the current projects properties.
 * Amongst them is the set of types for the current project,
 * which ProjectConfiguration provides to its clients.
 *
 * Within a project, objects of the available types can get created,
 * where every type is a configuration of different fields.
 *
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
@Injectable()
export class ProjectConfiguration {

    private typeMap: { [type: string]: any } = {};

    private excavation: string;

    private typesList: any[] = undefined;

    /**
     * @param configuration
     */
    constructor(configuration) {
        this.initTypeMap(configuration);
        this.expandTypesWithParentFields(configuration['types']);
        this.excavation=configuration['excavation'];

    }

    /**
     * @returns {any[]} array with objects containing the names and labels of all types of the current project.
     */
    public getTypes(): any[] {
        if(this.typesList) return this.typesList;

        var types = [];
        for (var typeKey of Object.keys(this.typeMap) ) {
            types.push({
                'name': this.typeMap[typeKey].name,
                'label':this.typeMap[typeKey].label
            });
        }
        this.typesList = types;
        return this.typesList;
    }

    /**
     * @param typeName
     * @returns {any[]} the fields definitions for the type.
     */
    public getFields(typeName: string): any[] {
        if(!this.typeMap[typeName]) return [];
        return this.typeMap[typeName]['fields'];
    }

    public getLabelForType(typeName: string): string {
        if(!this.typeMap[typeName]) return "";
        return this.typeMap[typeName].label;
    }

    /**
     * @returns {string} the name of the excavation, if defined.
     *   <code>undefined</code> otherwise.
     */
    public getExcavationName() : any {
        return this.excavation;
    }

    private initTypeMap(configuration) {
        for (var type of configuration['types']) {
            var typeName = this.name(type);
            this.typeMap[typeName] = {
                "name": typeName,
                "label": type["label"] || typeName,
                "fields": type.fields
            }
        }
    }

    private expandTypesWithParentFields(types) {
        for (var type of types) {
            if (this.hasParent(type)) {
                this.typeMap[this.name(type)].fields
                    = this.prependFieldsOfParentType(type);
            }
        }
    }

    private name(type) : string {
        return type.type;
    }

    private hasParent(type) : boolean {
        return type['parent'];
    }

    /**
     * @param type
     * @returns {Array[]} a new fields array, with the fields
     *   of the parent type from the field map first,
     *   and then the types own fields.
     */
    private prependFieldsOfParentType(type) {
        var fields=[];

        if (this.typeMap[type.parent]==undefined) {
            throw MD.PC_GENERIC_ERROR;
        } else
            fields=this.typeMap[type.parent].fields;

        return fields.concat(type.fields);
    }
}
