import {ConfigurationDefinition} from './configuration-definition';
import {MDInternal} from '../messages/md-internal';
import {TypeDefinition} from './type-definition';
import {ViewDefinition} from './view-definition';
import {RelationDefinition} from './relation-definition';

/**
 * @author F.Z.
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export class ConfigurationValidator {

    private static VALID_INPUT_TYPES = ['input', 'inputs', 'inputs_localized',
        'text', 'dropdown', 'radio', 'checkboxes', 'multiselect', 'unsignedInt',
        'float', 'unsignedFloat', 'dating', 'dimension', 'boolean'];
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
    public go(configuration: ConfigurationDefinition): Array<Array<string>> {

        let msgs = [];

        const invalidTypeErrors = this.findInvalidType(configuration.types);
        if (invalidTypeErrors) msgs = msgs.concat(invalidTypeErrors);
        
        const missingTypeErrors = this.findMissingType(configuration.types, this.namesOfMandatoryTypes);
        if (missingTypeErrors) msgs = msgs.concat(missingTypeErrors);

        const duplicateTypeErrors = this.findDuplicateType(configuration.types);
        if (duplicateTypeErrors) msgs = msgs.concat(duplicateTypeErrors);

        const missingParentTypeErrors = this.findMissingParentType(configuration.types);
        if (missingParentTypeErrors) msgs = msgs.concat(missingParentTypeErrors);

        if (configuration.views) {
            const missingViewTypeErrors = this.findMissingViewType(configuration.views, configuration.types);
            if (missingViewTypeErrors) msgs = msgs.concat(missingViewTypeErrors);
        }

        const missingRelationTypeErrors = this.findMissingRelationType(configuration.relations, configuration.types);
        if (missingRelationTypeErrors) msgs = msgs.concat(missingRelationTypeErrors);

        const mandatoryRelationsError = this.validateMandatoryRelations(configuration.relations);
        if (mandatoryRelationsError.length) msgs = msgs.concat(mandatoryRelationsError);

        const fieldError = this.validateFieldDefinitions(configuration.types);
        if (fieldError.length) msgs = msgs.concat(fieldError);

        return msgs;
    }

    /**
     * Check if all necessary fields are given and have the right type
     * (Might be refactored to use some kind of runtime type checking)
     *
     * @param types
     * @returns {string} invalidType. undefined if no error.
     */
    private findInvalidType(types: Array<TypeDefinition>): Array<Array<string>> {

        let msgs = [];
        for (let type of types) {
            if (!type.type || !(typeof type.type == 'string'))
                msgs.push([MDInternal.VALIDATION_ERROR_INVALIDTYPE, JSON.stringify(type)]);
        }
        return msgs;
    }

    private findDuplicateType(types: Array<TypeDefinition>): Array<Array<string>> {

        let msgs = [];
        var o = {};
        for (var typeName of types.map(type => type.type)) {
            if (o[typeName]) msgs.push([MDInternal.VALIDATION_ERROR_DUPLICATETYPE, typeName]);
            o[typeName] = true;
        }
        
        return msgs;
    }

    private findMissingType(types: Array<TypeDefinition>, namesOfMandatoryTypes: Array<string>): Array<Array<string>> {

        let msgs = [];

        if ( !namesOfMandatoryTypes || namesOfMandatoryTypes.length == 0) return msgs;

        for (var nameOfMandatoryType of namesOfMandatoryTypes) {
            let found: boolean = false;
            for (let type of types) {
                if (type.type == nameOfMandatoryType) found = true;
            }
            if (!found) {
                msgs.push([MDInternal.VALIDATION_ERROR_MISSINGTYPE, nameOfMandatoryType]);
            }
        }
        return msgs;
    }

    private findMissingParentType(types: Array<TypeDefinition>): Array<Array<string>> {


        let msgs = [];
        const typeNames: Array<string> = types.map(type => type.type);

        for (let type of types) {
            if (type.parent && typeNames.indexOf(type.parent) == -1)
                msgs.push([MDInternal.VALIDATION_ERROR_MISSINGPARENTTYPE, type.parent]);
        }
        
        return msgs;
    }

    private findMissingViewType(views: Array<ViewDefinition>, types: Array<TypeDefinition>): Array<Array<string>> {

        let msgs = [];
        const typeNames: Array<string> = types.map(type => type.type);

        for (let view of views) {
            if (view.mainType == 'project') continue;
            if (typeNames.indexOf(view.mainType) == -1)
                msgs.push([MDInternal.VALIDATION_ERROR_MISSINGVIEWTYPE, view.mainType]);
        }
        return msgs;
    }

    private findMissingRelationType(relations: Array<RelationDefinition>,
                                    types: Array<TypeDefinition>): Array<Array<string>> {

        let msgs = [];
        const typeNames: Array<string> = types.map(type => type.type);

        if (relations) for (let relation of relations) {
            for (let type of relation.domain)
                if (typeNames.indexOf(type) == -1)
                    msgs.push([MDInternal.VALIDATION_ERROR_MISSINGRELATIONTYPE, type]);
            for (let type of relation.range)
                if (typeNames.indexOf(type) == -1 && type != 'project')
                    msgs.push([MDInternal.VALIDATION_ERROR_MISSINGRELATIONTYPE, type]);
        }
        return msgs;
    }

    private validateMandatoryRelations(relations: Array<RelationDefinition>): Array<Array<string>> {

        let msgs = [];

        let recordedInRelations = {};
        if (relations) for (let relation of relations) {
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
                    msgs.push([MDInternal.VALIDATION_ERROR_INCOMPLETERECORDEDIN, type]);
                }
            }
        } else {
            msgs.push([MDInternal.VALIDATION_ERROR_NOPROJECTRECORDEDIN]);
        }

        return msgs;
    }

    private validateFieldDefinitions(types: Array<TypeDefinition>): Array<Array<string>> {

        let msgs = [];

        const fieldDefs = [].concat(...types.map(type => type.fields));

        for (let fieldDef of fieldDefs) {
            if (!fieldDef.hasOwnProperty('name'))
                msgs.push([MDInternal.VALIDATION_ERROR_MISSINGFIELDNAME, JSON.stringify(fieldDef)]);
            if (!fieldDef.hasOwnProperty('inputType'))
                fieldDef.inputType = 'input';
            if (ConfigurationValidator.VALID_INPUT_TYPES.indexOf(fieldDef.inputType) == -1)
                msgs.push([MDInternal.VALIDATION_ERROR_INVALIDINPUTTYPE, fieldDef.name,
                    fieldDef.inputType, ConfigurationValidator.VALID_INPUT_TYPES.join(', ')]);
            if (ConfigurationValidator.VALUELIST_INPUT_TYPES.indexOf(fieldDef.inputType) != -1
                    && (!fieldDef.hasOwnProperty('valuelist')
                        || !Array.isArray(fieldDef.valuelist)
                        || fieldDef.valuelist.length == 0
                )
            )
                msgs.push([MDInternal.VALIDATION_ERROR_MISSINGVALUELIST, fieldDef.name]);
        }

        return msgs;
    }
}
