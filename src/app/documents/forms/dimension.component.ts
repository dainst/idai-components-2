import {Component, Input} from '@angular/core';
import {Resource} from "../../model/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";


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

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {
    }
    public newDimension: {} = null;

    public createNewDimension() {
    	this.newDimension = {
    		"new": true,
    		"hasValue": 0,
			"hasMeasurementPosition": (this.field.position_values ? this.field.position_values[0] : "")  ,
			"hasMeasurementComment": "",
			"unit": "cm",
			"isImprecise": true,
			"hasLabel": ""
    	}
    }

    private convertInputToCm(dimension) {
    	let _val = parseFloat(dimension["hasValue"]);
    	if (dimension["unit"] == "m") dimension["hasValue"] = _val * 100;
    	if (dimension["unit"] == "mm") dimension["hasValue"] = _val / 10;
    }

    private generateLabel(dimension) {
    	dimension["hasLabel"] = (dimension["isImprecise"] ? "ca. " : "") + dimension["hasValue"] + "cm, Gemessen an " + dimension["hasMeasurementPosition"] + " (" + dimension["hasMeasurementComment"] + ")";
    }

    public cancelNewDimension() {
        this.newDimension = null;
    }

    public removeDimensionAtIndex(dimensionIndex) {
        this.resource[this.field.name].splice(dimensionIndex, 1);
    }

    public saveDimension(dimension) {
    	if (!this.resource[this.field.name]) this.resource[this.field.name] = [];

    	this.convertInputToCm(dimension);
    	this.generateLabel(dimension);
    	if (dimension["new"]) {
    		delete dimension["new"];
    		this.resource[this.field.name].push(dimension);
            this.newDimension = null;
    	} else {
    	    delete dimension["editing"];
        }
    	this.documentEditChangeMonitor.setChanged();
    }
}