import {Component, OnChanges, Input} from '@angular/core';
import {Resource} from '../../model/resource';
import {ProjectConfiguration} from '../../configuration/project-configuration';
import {to, isUndefinedOrEmpty} from 'tsfun';

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
            .map(to('name'));

        for (let fieldName of fieldNames) {

            if (fieldName === 'relations') continue;
            if (resource[fieldName] === undefined) continue;

            if (fieldName === 'hasPeriod') {
                this.fields.push({
                    name: 'Grobdatierung' +
                        !isUndefinedOrEmpty(resource['hasPeriodEnd']) ? ' (von)' : '',
                    value: FieldsViewComponent.getValue(resource, fieldName),
                    isArray: false
                });
                continue;
            }
            if (fieldName === 'hasPeriodBeginning') {
                this.fields.push({
                    name: 'Grobdatierung' +
                    !isUndefinedOrEmpty(resource['hasPeriodEnd']) ? ' (von)' : '',
                    value: FieldsViewComponent.getValue(resource, fieldName),
                    isArray: false
                });
                continue;
            }
            if (fieldName === 'hasPeriodEnd') {
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