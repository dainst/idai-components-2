import {Injectable} from '@angular/core';
import {MDInternal} from '../messages/md-internal';
import {IdaiType} from './idai-type';
import {FieldDefinition} from './field-definition';
import {RelationDefinition} from './relation-definition';
import {ViewDefinition} from './view-definition';
import {ConfigurationDefinition} from './configuration-definition';

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

    private projectIdentifier: string;

    private typesList: Array<IdaiType> = undefined;

    private typesTreeList: Array<IdaiType> = undefined;

    private relationFields: any[] = undefined;

    private viewsList: Array<ViewDefinition> = [];

    private viewsMap: { [name: string]: ViewDefinition } = {};


    /**
     * @param configuration
     */
    constructor(configuration) {

        this.initTypes(configuration);
        this.initViewsMap(configuration);

        this.projectIdentifier = configuration.identifier;
        this.relationFields = configuration.relations;
        this.viewsList = configuration.views;
    }

    public getInverseRelations(prop) {

        for (let p of this.relationFields) {
            if (p['name'] == prop) return p['inverse'];
        }
        return undefined;
    }

    public isRelationProperty(propertyName: string): boolean {

        for (let p of this.relationFields) {
            if (p['name'] == propertyName) return true;
        }
        return false;
    }

    /**
     * @returns {IdaiType[]} All types in flat array, ignoring hierarchy
     */
    public getTypesList(): IdaiType[] {

        if(this.typesList) return this.typesList;

        const types = [];
        for (let typeKey of Object.keys(this.typesMap)) {
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

        const types = [];
        for (let typeKey of Object.keys(this.typesTree)) {
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

    public getParentTypes(typeName: string): string[] {

        let parentTypes: string[] = [];
        let type = this.typesMap[typeName];
        while (type && type.parentType) {
            parentTypes.push(type.parentType.name);
            type = type.parentType;
        }
        return parentTypes;
    }

    /**
     * Gets the relation definitions available.
     *
     * @param typeName the name of the type to get the relation definitions for.
     * @param isRangeType If true, get relation definitions where the given type is part of the relation's range
     *                    (instead of domain)
     * @param property to give only the definitions with a certain boolean property not set or set to true
     * @returns {Array<RelationDefinition>} the definitions for the type.
     */
    public getRelationDefinitions(typeName: string, isRangeType: boolean = false, property?: string)
            : Array<RelationDefinition> {

        const availableRelationFields = new Array<RelationDefinition>();
        for (let i in this.relationFields) {
            let types = isRangeType ? this.relationFields[i].range : this.relationFields[i].domain;

            if (types.indexOf(typeName) > -1) {

                if (!property ||
                    this.relationFields[i][property] == undefined ||
                    this.relationFields[i][property] == true) {
                    availableRelationFields.push(this.relationFields[i]);
                }
            }
        }
        return availableRelationFields;
    }

    /**
     * @returns {boolean} True if the given domain type is a valid domain type for a relation definition which has the
     * given range type & name
     */
    public isAllowedRelationDomainType(domainType: IdaiType, rangeType: string, relationName: string): boolean {

        const relationDefinitions: Array<RelationDefinition> = this.getRelationDefinitions(rangeType, true);

        for (let relationDefinition of relationDefinitions) {
            if (relationName == relationDefinition.name
                && relationDefinition.domain.indexOf(domainType.name) > -1) return true;
        }

        return false;
    }

    /**
     * @param typeName
     * @returns {any[]} the fields definitions for the type.
     */
    public getFieldDefinitions(typeName: string): FieldDefinition[] {
        if (!this.typesMap[typeName]) return [];
        return this.typesMap[typeName].getFieldDefinitions();
    }

    public getLabelForType(typeName: string): string {
        if (!this.typesMap[typeName]) return '';
        return this.typesMap[typeName].label;
    }

    public isMandatory(typeName: string, fieldName: string): boolean {
        return this.hasProperty(typeName, fieldName, 'mandatory')
    }
    
    public isVisible(typeName: string, fieldName: string): boolean {
        return this.hasProperty(typeName, fieldName,'visible')
    }

    public isVisibleRelation(relationName:string): boolean {

        for (let i in this.relationFields) {
            if (this.relationFields[i].name == relationName &&
                this.relationFields[i].visible != undefined &&
                    this.relationFields[i].visible == false) {

                return false;
            }
        }
        return true;
    }

    private hasProperty(typeName: string, fieldName: string, propertyName: string) {

        if (!this.typesMap[typeName]) return false;
        const fields = this.typesMap[typeName].getFieldDefinitions();

        for (let i in fields) {
            if (fields[i].name == fieldName) {
                if (fields[i][propertyName] == true) {
                    return true;
                }
            }
        } 
        return false;
    }

    /**
     * Should be used only from within components.
     * 
     * @param relationName
     * @returns {string}
     */
    public getRelationDefinitionLabel(relationName: string): string {

        const relationFields = this.relationFields;
        return this.getLabel(relationName, relationFields);
    }

    /**
     * Gets the label for the field if it is defined.
     * Otherwise it returns the fields definitions name.
     *
     * @param typeName
     * @param fieldName
     * @returns {string}
     * @throws {string} with an error description in case the type is not defined.
     */
    public getFieldDefinitionLabel(typeName: string, fieldName: string): string {

        const fieldDefinitions = this.getFieldDefinitions(typeName);
        if (fieldDefinitions.length == 0)
            throw 'No type definition found for type \'' + typeName + '\'';

        return this.getLabel(fieldName, fieldDefinitions);
    }

    private getLabel(fieldName: string, fields: Array<any>): string{

        for (let i in fields) {
            if (fields[i].name == fieldName) {
                if (fields[i].label) {
                    return fields[i].label;
                } else {
                    return fieldName;
                }
            }
        }

        return fieldName;
    }

    /**
     * @returns {string} the name of the excavation, if defined.
     *   <code>undefined</code> otherwise.
     */
    public getProjectIdentifier(): any {
        return this.projectIdentifier;
    }

    private initTypes(configuration: ConfigurationDefinition) {

        for (let type of configuration.types) {
            let typeName = this.getTypeName(type);
            this.typesMap[typeName] = new IdaiType(type);
        }

        for (let type of configuration.types) {
            let typeName = this.getTypeName(type);
            if (!type['parent']) {
                this.typesTree[typeName] = this.typesMap[typeName];
            } else {
                let parentType = this.typesMap[type.parent];
                if (parentType == undefined)
                    throw MDInternal.PC_GENERIC_ERROR;
                parentType.addChildType(this.typesMap[typeName]);
            }
        }
    }

    private initViewsMap(configuration: ConfigurationDefinition) {

        if (!configuration.views) return;

        for (let view of configuration.views) {
            this.viewsMap[view.name] = view;
        }
    }

    private getTypeName(type): string {
        return type.type;
    }

    public getViewsList(): Array<ViewDefinition> {
        return this.viewsList;
    }

    public getView(name: string): ViewDefinition {
        return this.viewsMap[name];
    }

}
