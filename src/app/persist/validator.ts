import {Injectable} from "@angular/core";
import {MDInternal} from "../messages/md-internal";
import {ConfigLoader} from '../configuration/config-loader';
import {Document} from '../model/document';
import {ProjectConfiguration} from "../configuration/project-configuration";


/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
@Injectable()
export class Validator {

    constructor(private configLoader: ConfigLoader) {}

    /**
     * @param doc
     * @returns resolves with () or rejects with msgsWithParams
     */
    public validate(doc: Document): Promise<any> {

        return this.configLoader.getProjectConfiguration().then(projectConfiguration => {

            let resource = doc['resource'];

            if (!Validator.validateType(resource,projectConfiguration)) {
                let err = [MDInternal.VALIDATION_ERROR_INVALIDTYPE];
                err.push(resource.id);
                err.push("\"" + resource.type + "\"");
                return Promise.reject(err);
            }

            let missingProperties = Validator.getMissingProperties(resource,projectConfiguration);
            if (missingProperties.length > 0) {
                return Promise.reject([MDInternal.VALIDATION_ERROR_MISSINGPROPERTY,resource.type].concat(missingProperties.join((", "))));
            }


            let invalidFields;
            if (invalidFields = Validator.validateFields(resource,projectConfiguration)) {
                let errr = [invalidFields.length == 1 ? MDInternal.VALIDATION_ERROR_INVALIDFIELD : MDInternal.VALIDATION_ERROR_INVALIDFIELDS];
                errr.push(resource.type);
                errr.push(invalidFields.join(", "));
                return Promise.reject(errr);
            }

            return this.validateCustom(doc);
        });
    }

    protected validateCustom(doc: Document): Promise<any> {
        return Promise.resolve();
    }


    private static getMissingProperties(resource: any,projectConfiguration:ProjectConfiguration) {


        let missingFields = [];
        let fieldDefinitions = projectConfiguration.getFieldDefinitions(resource.type);
        for (let fieldDefinition of fieldDefinitions) {
            if (projectConfiguration.isMandatory(resource.type,fieldDefinition.name)) {
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
     * @param projectConfiguration
     * @returns {boolean} true if the type of the resource is valid, otherwise false
     */
    private static validateType(resource: any,projectConfiguration:ProjectConfiguration): boolean {

        if (!resource.type) return false;

        let types = projectConfiguration.getTypesList();

        for (let i in types) {
            if (types[i].name == resource.type) return true;
        }

        return false;
    }

    /**
     *
     * @param resource
     * @param projectConfiguration
     * @returns {string[]} the names of invalid fields if one ore more of the fields are invalid, otherwise
     * <code>undefined</code>
     */
    private static validateFields(resource: any,projectConfiguration:ProjectConfiguration): string[] {

        let projectFields = projectConfiguration.getFieldDefinitions(resource.type);
        let relationFields = projectConfiguration.getRelationDefinitions(resource.type);


        let defaultFields = [
            { name: "relations" } ];

        let fields = projectFields.concat(relationFields).concat(defaultFields);

        let invalidFields = [];

        for (let resourceField in resource) {

            if (resource.hasOwnProperty(resourceField)) {
                let fieldFound = false;
                for (let i in fields) {
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

        if (invalidFields.length > 0) {
            return invalidFields;
        }
        else {
            return undefined;
        }
    }
}