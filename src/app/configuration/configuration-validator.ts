import {ConfigurationDefinition} from "./configuration-definition";
import {MDInternal} from "../messages/md-internal";
import {TypeDefinition} from "./type-definition";

/**
 * @author F.Z.
 * @author Daniel de Oliveira
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
    public go(
        configuration: ConfigurationDefinition,
        ) : Array<string> {


        var missingType = this
            .findMissingType(configuration.types,this.namesOfMandatoryTypes);
        if (missingType)
            return [MDInternal.VALIDATION_ERROR_MISSINGTYPE,missingType];

        var duplicateType = this
            .findDuplicateType(configuration.types);
        if (duplicateType)
            return [MDInternal.VALIDATION_ERROR_DUPLICATETYPE,duplicateType];

        return undefined;
    }

    private findDuplicateType(types: Array<TypeDefinition>) {

        var o = {};
        for (var typeName of types.map(t=>t.type)) {
            if (o[typeName]) return typeName;
            o[typeName] = true;
        }
    }

    private findMissingType(
        types: Array<TypeDefinition>,
        namesOfMandatoryTypes: Array<string>
    ) {
        if ( !namesOfMandatoryTypes || namesOfMandatoryTypes.length == 0) return undefined;

        var missingType;
        for (var nameOfMandatoryType of namesOfMandatoryTypes) {
            var found = false;
            for (var type of types) {
                if (type.type == nameOfMandatoryType) found = true;
            }
            if (!found) {
                missingType = nameOfMandatoryType;
                break;
            }
        }
        return missingType;
    }
}
