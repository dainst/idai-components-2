import {Component, OnChanges, Input} from "@angular/core";
import {ConfigLoader} from "../configuration/config-loader";
import {Resource} from "../model/resource";

@Component({
    selector: 'fields-view',
    moduleId: module.id,
    templateUrl: './fields-view.html'
})

/**
 * Shows fields of a document.
 *
 * @author Thomas Kleinke
 * @author Sebastian Cuy
 */
export class FieldsViewComponent implements OnChanges {

    protected fields: Array<any>;

    @Input() doc;

    constructor(
        private configLoader: ConfigLoader
    ) { }

    ngOnChanges() {
        this.fields = [];
        if (!this.doc) return;
        this.processFields(this.doc.resource);
    }

    private processFields(resource: Resource) {

        this.configLoader.getProjectConfiguration().then(
            projectConfiguration => {

            const ignoredFields: Array<string> = [ "relations" ];

            for (let fieldName in resource) {

                if (projectConfiguration.isVisible(resource.type,fieldName)==false) continue;

                if (resource.hasOwnProperty(fieldName) && ignoredFields.indexOf(fieldName) == -1) {
                    this.fields.push({
                        name: projectConfiguration.getFieldDefinitionLabel(resource.type, fieldName),
                        value: resource[fieldName],
                        isArray: Array.isArray(resource[fieldName])
                    });
                }
            }
        })
    }
}