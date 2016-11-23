import {ProjectConfiguration} from "./project-configuration";
import {FieldDefinition} from "./field-definition";

interface ConfigurationValidationResult {
    errors : string[]
}

export class ConfigurationValidator {
    private errors : string[];
    private projectConfig : ProjectConfiguration;

    constructor(private mandatoryFields:Array<FieldDefinition>, private mandatoryTypes: Array<string>) { }

    private validateMandatoryFields () {
        var typesList = this.projectConfig.getTypesList();

        this.mandatoryFields.forEach(mandatoryField => {
            typesList.forEach(type => {
                var mandatoryFieldFoundAt = -1;
                type.getFieldDefinitions().forEach(function (fieldDef, index) {

                    if(fieldDef.name == mandatoryField.name) {
                        // if necessary, move mandatory field to right index
                        if ((mandatoryFieldFoundAt = index) != mandatoryField['index'])
                            type.moveField(mandatoryFieldFoundAt, mandatoryField['index']);
                        return;
                    }
                });
                // if mandatory field was not found add it
                if (mandatoryFieldFoundAt == -1) {
                    type.insertFieldAtIndex(mandatoryField, mandatoryField['index']);
                }
            })
        })
    }


    private validateMandatoryTypes () {
        this.mandatoryTypes.forEach(mandatoryType => {
            if(!this.projectConfig.getTypesMap()[mandatoryType]) {
                this.errors.push("ConfigurationValidator - Missing mandatory type: " + mandatoryType);
            }
        })
    }

    public validate(
        projectConfiguration: ProjectConfiguration):
    ConfigurationValidationResult {

        this.projectConfig = projectConfiguration;
        this.errors = [];

        this.validateMandatoryTypes();

        this.validateMandatoryFields();

        return {
            errors:  this.errors
        }
    }
}
