import {ConfigurationDefinition} from './configuration-definition';
import {MDInternal} from '../messages/md-internal';
import {TypeDefinition} from './type-definition';
import {ViewDefinition} from "./view-definition";
import {RelationDefinition} from "./relation-definition";

/**
 * @author F.Z.
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export class ConfigurationValidator {

    private static VALID_INPUT_TYPES = ['input', 'inputs', 'inputs_localized',
        'text', 'dropdown', 'radio', 'checkboxes', 'multiselect'];
    private static VALUELIST_INPUT_TYPES = ['dropdown', 'radio', 'checkboxes',
        'multiselect'];

    /**
     * @param namesOfMandatoryTypes
     */
    constructor(private namesOfMandatoryTypes: Array<string>) { }

    /**
     * Searches for missing mandatory types or duplicate types.
     * Returns on the first occurrence of either one.
     *
     * @param configuration
     * @returns {Array<string>} msgWithParams. undefined if no error.
     */
    public go(configuration: ConfigurationDefinition): Array<string> {

        const invalidType = this.findInvalidType(configuration.types);
        if (invalidType) return [MDInternal.VALIDATION_ERROR_INVALIDTYPE, invalidType];
        
        const missingType = this.findMissingType(configuration.types, this.namesOfMandatoryTypes);
        if (missingType) return [MDInternal.VALIDATION_ERROR_MISSINGTYPE, missingType];

        const duplicateType = this.findDuplicateType(configuration.types);
        if (duplicateType) return [MDInternal.VALIDATION_ERROR_DUPLICATETYPE, duplicateType];

        const missingParentType = this.findMissingParentType(configuration.types);
        if (missingParentType) return [MDInternal.VALIDATION_ERROR_MISSINGPARENTTYPE, missingParentType];

        if (configuration.views) {
            const missingViewType = this.findMissingViewType(configuration.views, configuration.types);
            if (missingViewType) return [MDInternal.VALIDATION_ERROR_MISSINGVIEWTYPE, missingViewType];
        }

        const missingRelationType = this.findMissingRelationType(configuration.relations, configuration.types);
        if (missingRelationType) return [MDInternal.VALIDATION_ERROR_MISSINGRELATIONTYPE, missingRelationType];

        const mandatoryRelationsError = this.validateMandatoryRelations(configuration.relations, configuration.types);
        if (mandatoryRelationsError.length) return mandatoryRelationsError;

        const fieldError = this.validateFieldDefinitions(configuration.types);
        if (fieldError.length) return fieldError;

        return undefined;
    }

    /**
     * Check if all necessary fields are given and have the right type
     * (Might be refactored to use some kind of runtime type checking)
     *
     * @param types
     * @returns {string} invalidType. undefined if no error.
     */
    private findInvalidType(types: Array<TypeDefinition>): string {
        for (let type of types) {
            if (!type.type || !(typeof type.type == 'string'))
                return JSON.stringify(type);
        }
        return undefined;
    }

    private findDuplicateType(types: Array<TypeDefinition>): string {

        var o = {};
        for (var typeName of types.map(type => type.type)) {
            if (o[typeName]) return typeName;
            o[typeName] = true;
        }
        
        return undefined;
    }

    private findMissingType(types: Array<TypeDefinition>, namesOfMandatoryTypes: Array<string>): string {

        if ( !namesOfMandatoryTypes || namesOfMandatoryTypes.length == 0) return undefined;

        let missingType: string;
        for (var nameOfMandatoryType of namesOfMandatoryTypes) {
            let found: boolean = false;
            for (let type of types) {
                if (type.type == nameOfMandatoryType) found = true;
            }
            if (!found) {
                missingType = nameOfMandatoryType;
                break;
            }
        }
        return missingType;
    }

    private findMissingParentType(types: Array<TypeDefinition>): string {

        const typeNames: Array<string> = types.map(type => type.type);

        for (let type of types) {
            if (type.parent && typeNames.indexOf(type.parent) == -1) return type.parent;
        }
        
        return undefined;
    }

    private findMissingViewType(views: Array<ViewDefinition>, types: Array<TypeDefinition>): string {

        const typeNames: Array<string> = types.map(type => type.type);

        for (let view of views) {
            if (view.mainType == 'project') continue;
            if (typeNames.indexOf(view.mainType) == -1) return view.mainType;
        }
        return undefined;
    }

    private findMissingRelationType(relations: Array<RelationDefinition>, types: Array<TypeDefinition>): string {

        const typeNames: Array<string> = types.map(type => type.type);

        for (let relation of relations) {
            for (let type of relation.domain)
                if (typeNames.indexOf(type) == -1) return type;
            for (let type of relation.range)
                if (typeNames.indexOf(type) == -1 && type != 'project') return type;
        }
        return undefined;
    }

    private validateMandatoryRelations(relations: Array<RelationDefinition>, types: Array<TypeDefinition>): Array<string> {

        let recordedInRelations = {};
        for (let relation of relations) {
            if (relation.name == 'isRecordedIn') {
                for (let type of relation.range) {
                    recordedInRelations[type] = relation.domain;
                }
            }
        }

        if ('project' in recordedInRelations) {
            for (let type of recordedInRelations['project']) {
                if (!(type in recordedInRelations) || !recordedInRelations[type]
                        || recordedInRelations[type].length == 0) {
                    return [MDInternal.VALIDATION_ERROR_INCOMPLETERECORDEDIN, type];
                }
            }
        } else {
            return [MDInternal.VALIDATION_ERROR_INCOMPLETERECORDEDIN, 'project'];
        }

        return [];
    }

    private validateFieldDefinitions(types: Array<TypeDefinition>): Array<string> {

        const fieldDefs = [].concat(...types.map(type => type.fields));

        for (let fieldDef of fieldDefs) {
            if (!fieldDef.hasOwnProperty('name'))
                return [MDInternal.VALIDATION_ERROR_MISSINGFIELDNAME, JSON.stringify(fieldDef)];
            if (!fieldDef.hasOwnProperty('inputType'))
                fieldDef.inputType = 'input';
            if (ConfigurationValidator.VALID_INPUT_TYPES.indexOf(fieldDef.inputType) == -1)
                return [MDInternal.VALIDATION_ERROR_INVALIDINPUTTYPE, fieldDef.name,
                    fieldDef.inputType, ConfigurationValidator.VALID_INPUT_TYPES.join(', ')];
            if (ConfigurationValidator.VALUELIST_INPUT_TYPES.indexOf(fieldDef.inputType) != -1
                    && (!fieldDef.hasOwnProperty('valuelist')
                        || !Array.isArray(fieldDef.valuelist)
                        || fieldDef.valuelist.length == 0
                )
            )
                return [MDInternal.VALIDATION_ERROR_MISSINGVALUELIST, fieldDef.name];
        }

        return [];
    }
}
