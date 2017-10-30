import {Component, Input} from '@angular/core';
import {Resource} from '../../../model/resource';
import {DocumentEditChangeMonitor} from '../document-edit-change-monitor';
import {DecimalPipe} from '@angular/common';

/**
 * @author Fabian Z.
 */
@Component({
    moduleId: module.id,
    selector: 'dai-dimension',
    templateUrl: './dimension.html'
})

export class DimensionComponent {

    @Input() resource: Resource;
    @Input() field: any;

    public newDimension: any = null;


    constructor(
        private documentEditChangeMonitor: DocumentEditChangeMonitor,
        private decimalPipe: DecimalPipe) {
    }


    public createNewDimension() {

    	this.newDimension = {
    		'new': true,
    		'hasValue': 0,
            'hasInputValue': 0,
            'hasInputRangeEndValue': 0,
			'hasMeasurementPosition': '',
			'hasMeasurementComment': '',
			'hasInputUnit': 'cm',
			'isImprecise': false,
            'isRange': false,
			'hasLabel': ''
    	};
    }


    private convertValueFromInputUnitToMicrometre(inputUnit: string, inputValue: string): Number {

    	let _val = parseFloat(inputValue);
        if (inputUnit == 'mm') return _val * 1000;
    	if (inputUnit == 'cm') return _val * 10000;
    	if (inputUnit == 'm') return _val * 1000000;
    }


    private generateLabel(dimension) {

        let label = (dimension['isImprecise'] ? 'ca. ' : '');

        if (dimension.isRange) {
            label += `${this.decimalPipe.transform(dimension['hasInputValue'])}-${this.decimalPipe.transform(dimension['hasInputRangeEndValue'])}`;
        } else {
            label += this.decimalPipe.transform(dimension['hasInputValue']);
        }

        label += ` ${dimension['hasInputUnit']}`;

        if (this.field.unitSuffix && this.field.unitSuffix != '') label += ` ${this.field.unitSuffix}`;

    	if (dimension['hasMeasurementPosition']) label += `, Gemessen an ${dimension['hasMeasurementPosition']}`;
    	if (dimension['hasMeasurementComment']) label += ` (${dimension['hasMeasurementComment']})`;

        dimension['hasLabel'] = label;
    }


    public cancelNewDimension() {

        this.newDimension = null;
    }


    public removeDimensionAtIndex(dimensionIndex) {

        this.resource[this.field.name].splice(dimensionIndex, 1);
    }


    public saveDimension(dimension) {

    	if (!this.resource[this.field.name]) this.resource[this.field.name] = [];

        if (dimension.isRange) {
            dimension['hasRangeMin'] = this.convertValueFromInputUnitToMicrometre(dimension['hasInputUnit'],
                dimension['hasInputValue']);
            dimension['hasRangeMax'] = this.convertValueFromInputUnitToMicrometre(dimension['hasInputUnit'],
                dimension['hasInputRangeEndValue']);
            delete(dimension['hasValue']);
        } else {
    	    dimension['hasValue'] = this.convertValueFromInputUnitToMicrometre(dimension['hasInputUnit'],
                dimension['hasInputValue']);
        }

    	this.generateLabel(dimension);

        if (this.field.unitSuffix && this.field.unitSuffix != '') dimension['unitSuffix'] = this.field.unitSuffix;

    	if (dimension['new']) {
    		delete dimension['new'];
    		this.resource[this.field.name].push(dimension);
            this.newDimension = null;
    	} else {
    	    delete dimension['editing'];
        }

    	this.documentEditChangeMonitor.setChanged();
    }
}