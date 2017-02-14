import {Component, OnInit, OnChanges, Input} from "@angular/core";
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
export class FieldsViewComponent implements OnInit, OnChanges {

    protected fields: Array<any>;

    @Input() doc;

    constructor(
        private configLoader: ConfigLoader
    ) {
    }

    private init() {
        this.fields = [];
        if (!this.doc) return;
        this.initializeFields(this.doc.resource);
    }

    ngOnInit() {
        this.init();
    }

    ngOnChanges() {
        this.init();
    }

    private initializeFields(resource: Resource) {

        this.configLoader.getProjectConfiguration().then(
            projectConfiguration => {

            const ignoredFields: Array<string> = [ "relations" ];

            for (var fieldName in resource) {

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