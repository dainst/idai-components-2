import {Component, OnChanges, Input} from '@angular/core';
import {to} from 'tsfun';
import {isUndefinedOrEmpty} from 'tsfun/src/predicates';
import {Resource} from '../../model/core/resource';
import {ProjectConfiguration} from '../../configuration/project-configuration';

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

    @Input() resource: Resource;

    protected fields: Array<any>;


    constructor(private projectConfiguration: ProjectConfiguration) {}


    ngOnChanges() {

        this.fields = [];
        if (this.resource) this.processFields(this.resource);
    }


    public isBoolean(value: any): boolean {

        return typeof value === 'boolean';
    }


    private processFields(resource: Resource) {

        const fieldNames = this.projectConfiguration
            .getFieldDefinitions(resource.type)
            .map(to('name'))
            .concat(['periodBeginning', 'periodEnd']);

        for (let fieldName of fieldNames) {

            if (fieldName === 'relations') continue;
            if (resource[fieldName] === undefined) continue;

            if (fieldName === 'period') {
                this.fields.push({
                    name: ('Grobdatierung' + (!isUndefinedOrEmpty(resource['periodEnd']) ? ' (von)' : '')),
                    value: FieldsViewComponent.getValue(resource, fieldName),
                    isArray: false
                });
                continue;
            }
            if (fieldName === 'periodBeginning') {
                this.fields.push({
                    name: ('Grobdatierung' + (!isUndefinedOrEmpty(resource['periodEnd']) ? ' (von)' : '')),
                    value: FieldsViewComponent.getValue(resource, fieldName),
                    isArray: false
                });
                continue;
            }
            if (fieldName === 'periodEnd') {
                this.fields.push({
                    name: 'Grobdatierung (bis)',
                    value: FieldsViewComponent.getValue(resource, fieldName),
                    isArray: false
                });
                continue;
            }


            if (!this.projectConfiguration.isVisible(resource.type, fieldName)) continue;

            this.fields.push({
                name: this.projectConfiguration.getFieldDefinitionLabel(resource.type, fieldName),
                value: FieldsViewComponent.getValue(resource, fieldName),
                isArray: Array.isArray(resource[fieldName])
            });
        }
    }


    private static getValue(resource: Resource, fieldName: string): any {

        if (typeof resource[fieldName] === 'string') {
            return resource[fieldName]
                .replace(/^\s+|\s+$/g, '')
                .replace(/\n/g, '<br>');
        } else {
            return resource[fieldName];
        }
    }
}