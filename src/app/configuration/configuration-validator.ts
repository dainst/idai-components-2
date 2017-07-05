import {ConfigurationDefinition} from './configuration-definition';
import {MDInternal} from '../messages/md-internal';
import {TypeDefinition} from './type-definition';

/**
 * @author F.Z.
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export class ConfigurationValidator {

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
        
        const missingType = this.findMissingType(configuration.types, this.namesOfMandatoryTypes);
        if (missingType) return [MDInternal.VALIDATION_ERROR_MISSINGTYPE, missingType];

        const duplicateType = this.findDuplicateType(configuration.types);
        if (duplicateType) return [MDInternal.VALIDATION_ERROR_DUPLICATETYPE, duplicateType];

        const missingParentType = this.findMissingParentType(configuration.types);
        if (missingParentType) return [MDInternal.VALIDATION_ERROR_MISSINGPARENTTYPE, missingParentType];

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
}
