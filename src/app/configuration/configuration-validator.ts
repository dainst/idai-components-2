import {ConfigurationDefinition} from "./configuration-definition";
import {MDInternal} from "../messages/md-internal";
import {TypeDefinition} from "./type-definition";

/**
 * @author F.Z.
 * @author Daniel de Oliveira
 */
export class ConfigurationValidator {

    /**
     * Searches for missing mandatory types or duplicate types.
     * Returns on the first occurrence of either one.
     *
     * @param configuration
     * @param namesOfMandatoryTypes
     * @returns {Array<string>} msgWithParams. undefined if no error.
     */
    public static go(
        configuration: ConfigurationDefinition,
        namesOfMandatoryTypes: Array<string>) : Array<string> {


        var missingType = ConfigurationValidator
            .findMissingType(configuration.types,namesOfMandatoryTypes);
        if (missingType)
            return [MDInternal.VALIDATION_ERROR_MISSINGTYPE,missingType];

        var duplicateType = ConfigurationValidator
            .findDuplicateType(configuration.types);
        if (duplicateType)
            return [MDInternal.VALIDATION_ERROR_DUPLICATETYPE,duplicateType];

        return undefined;
    }

    private static findDuplicateType(types: Array<TypeDefinition>) {
        var typeNames : Array<string> = [];
        for (var type of types) typeNames.push(type.type);
        var typeNamesSorted = typeNames.slice().sort();

        for (var i = 0; i < typeNamesSorted.length - 1; i++) {
            if (typeNamesSorted[i + 1] == typeNamesSorted[i]) {
                return typeNamesSorted[i];
            }
        }
        return undefined;
    }

    private static findMissingType(
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
