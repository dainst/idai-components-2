import {Injectable} from "@angular/core";
import {MDInternal} from "../core-services/md-internal";
import {IdaiType} from "../core-services/idai-type";
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

    private typesTree: { [type: string]: IdaiType } = {};

    private typesMap: { [type: string]: IdaiType } = {};

    private excavation: string;

    private typesList: IdaiType[] = undefined;

    private typesTreeList: IdaiType[] = undefined;

    private relationFields: any[] = undefined;


    /**
     * @param configuration
     */
    constructor(configuration) {
        this.initTypesTree(configuration);
        this.initTypesMap();
        this.excavation=configuration['excavation'];
        this.relationFields = configuration['relations'];
    }

    public getRelationFields() {
        return this.relationFields;
    }

    public getInverseRelations(prop) {
        for (var p of this.relationFields) {
            if (p["name"]==prop) return p["inverse"];
        }
        return undefined;
    }

    public isRelationProperty(propertyName:string):boolean {
        for (var p of this.relationFields) {
            if (p["name"]==propertyName) return true;
        }
        return false;
    }

    /**
     * @returns {IdaiType[]} All types in flat array, ignoring hierarchy
     */
    public getTypesList(): IdaiType[] {
        if(this.typesList) return this.typesList;

        var types = [];
        for (var typeKey of Object.keys(this.typesMap)) {
            types.push(this.typesMap[typeKey]);
        }
        this.typesList = types;
        return this.typesList;
    }

    /**
     * @returns {IdaiType[]} All root types in array, including child types
     */
    public getTypesTreeList(): IdaiType[] {
        if(this.typesTreeList) return this.typesTreeList;

        var types = [];
        for (var typeKey of Object.keys(this.typesTree)) {
            types.push(this.typesTree[typeKey]);
        }
        this.typesTreeList = types;
        return this.typesTreeList;
    }

    public getTypesMap(): any {
        return this.typesMap;
    }

    public getTypesTree() : any {
        return this.typesTree;
    }

    /**
     * @param typeName
     * @returns {any[]} the fields definitions for the type.
     */
    public getFields(typeName: string): any[] {
        if(!this.typesMap[typeName]) return [];
        return this.typesMap[typeName].getFields();
    }

    public getLabelForType(typeName: string): string {
        if(!this.typesMap[typeName]) return "";
        return this.typesMap[typeName].label;
    }

    /**
     * @returns {string} the name of the excavation, if defined.
     *   <code>undefined</code> otherwise.
     */
    public getExcavationName() : any {
        return this.excavation;
    }

    private initTypesTree(configuration) {
        for (var type of configuration['types']) {
            if (!type['parent']) this.typesTree[this.getTypeName(type)] = new IdaiType(type);
        }

        for (var type of configuration['types']) {
            if (type['parent']) {
                if (this.typesTree[type.parent] == undefined) {
                    throw MDInternal.PC_GENERIC_ERROR;
                } else
                    var parentType = this.typesTree[type.parent]
                    parentType.addChildType(type)
            }
        }
    }

    private initTypesMap() {
        var typesMap:{[type: string]: IdaiType } = {};

        for (var typeKey of Object.keys(this.typesTree)) {
            var idaiType: IdaiType = this.typesTree[typeKey];
            typesMap[typeKey] = idaiType;
            if (idaiType.children) {
                for (var childType of idaiType.children) typesMap[childType.name] = childType;
            }
        }
        this.typesMap = typesMap;
    }

    private getTypeName(type) : string {
        return type.type;
    }
}
