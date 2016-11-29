import {Component, OnInit, OnChanges, Input} from "@angular/core";
import {ReadDatastore} from "../datastore/read-datastore";
import {ConfigLoader} from "../configuration/config-loader";
import {WithConfiguration} from "../configuration/with-configuration";
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
export class FieldsViewComponent extends WithConfiguration implements OnInit, OnChanges {

    protected fields: Array<any>;

    @Input() doc;

    constructor(
        private datastore: ReadDatastore,
        configLoader: ConfigLoader
    ) {
        super(configLoader);
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

        const ignoredFields: Array<string> = [ "id", "identifier", "shortDescription", "type", "relations", "geometries" ];

        for (var fieldName in resource) {
            if (resource.hasOwnProperty(fieldName) && ignoredFields.indexOf(fieldName) == -1) {
                this.fields.push({
                    name: this.projectConfiguration.getFieldDefinitionLabel(resource.type, fieldName),
                    value: resource[fieldName],
                    isArray: Array.isArray(resource[fieldName])
                });
            }
        }
    }
}