import {Injectable} from "@angular/core";
import {MDInternal} from "../messages/md-internal";
import {ConfigLoader} from '../configuration/config-loader';
import {Document} from '../model/document';
import {WithConfiguration} from '../configuration/with-configuration';


/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
@Injectable()
export class Validator extends WithConfiguration {

    constructor(configLoader: ConfigLoader) {
        super(configLoader);
    }

    /**
     * @param doc
     * @returns {any} the validation report containing the error message as key of m and possibly additional data
     * (e. g. the name of an invalid field)
     */
    public validate(doc: Document): any {

        var resource = doc['resource'];

        // if (resource.id) {

        if (!this.validateType(resource)) {
            var err = [MDInternal.VALIDATION_ERROR_INVALIDTYPE];
            err.push(resource.id);
            err.push("\"" + resource.type + "\"");
            return err;
        }

        var missingProperties = this.getMissingProperties(resource);
        if (missingProperties.length > 0) {
            return [MDInternal.VALIDATION_ERROR_MISSINGPROPERTY,resource.type].concat(missingProperties.join((", ")))
        }


        var invalidFields;
        if (invalidFields = this.validateFields(resource)) {
            var errr = [invalidFields.length == 1 ? MDInternal.VALIDATION_ERROR_INVALIDFIELD : MDInternal.VALIDATION_ERROR_INVALIDFIELDS];
            errr.push(resource.type);
            errr.push(invalidFields.join(", "));
            return errr;
        }
        // }

        return undefined;
    }


    private getMissingProperties(resource: any) {
        var missingFields = [];
        var fieldDefinitions = this.projectConfiguration.getFieldDefinitions(resource.type);
        for (var fieldDefinition of fieldDefinitions) {
            if (this.projectConfiguration.isMandatory(resource.type,fieldDefinition.name)) {
                if (resource[fieldDefinition.name] == undefined || resource[fieldDefinition.name] == "") {
                    missingFields.push(fieldDefinition.name);
                }
            }
        }
        return missingFields;
    }


    /**
     *
     * @param resource
     * @returns {boolean} true if the identifier of the resource is valid, otherwise false
     */
    private validateIdentifier(resource: any): boolean {

        return resource.identifier && resource.identifier.length > 0;
    }

    /**
     *
     * @param resource
     * @returns {boolean} true if the type of the resource is valid, otherwise false
     */
    private validateType(resource: any): boolean {

        if (!resource.type) return false;

        var types = this.projectConfiguration.getTypesList();

        for (var i in types) {
            if (types[i].name == resource.type) return true;
        }

        return false;
    }

    /**
     *
     * @param resource
     * @returns {string[]} the names of invalid fields if one ore more of the fields are invalid, otherwise
     * <code>undefined</code>
     */
    private validateFields(resource: any): string[] {

        var projectFields = this.projectConfiguration.getFieldDefinitions(resource.type);
        var relationFields = this.projectConfiguration.getRelationDefinitions(resource.type);


        var defaultFields = [
            { name: "relations" } ];

        var fields = projectFields.concat(relationFields).concat(defaultFields);

        var invalidFields = [];

        for (var resourceField in resource) {

            if (resource.hasOwnProperty(resourceField)) {
                var fieldFound = false;
                for (var i in fields) {
                    if (fields[i].name == resourceField) {
                        fieldFound = true;
                        break;
                    }
                }
                if (!fieldFound) {
                    invalidFields.push( resourceField );
                }
            }
        }

        if (invalidFields.length > 0)
            return invalidFields;
        else
            return undefined;
    }
}