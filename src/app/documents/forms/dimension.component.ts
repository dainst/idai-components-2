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
            "hasInputValue": 0,
			"hasMeasurementPosition": (this.field.position_values ? this.field.position_values[0] : "")  ,
			"hasMeasurementComment": "",
			"hasInputUnit": "cm",
			"isImprecise": false,
			"hasLabel": ""
    	}
    }

    private convertInputToMM(dimension) {
    	let _val = parseFloat(dimension["hasInputValue"]);
        if (dimension["hasInputUnit"] == "mm") dimension["hasValue"] = _val * 1000;
    	if (dimension["hasInputUnit"] == "cm") dimension["hasValue"] = _val * 10000;
    	if (dimension["hasInputUnit"] == "m") dimension["hasValue"] = _val * 1000000;
    }

    private generateLabel(dimension) {
    	dimension["hasLabel"] = (dimension["isImprecise"] ? "ca. " : "") + dimension["hasInputValue"] + dimension["hasInputUnit"] +  ", Gemessen an " + dimension["hasMeasurementPosition"] + " (" + dimension["hasMeasurementComment"] + ")";
    }

    public cancelNewDimension() {
        this.newDimension = null;
    }

    public removeDimensionAtIndex(dimensionIndex) {
        this.resource[this.field.name].splice(dimensionIndex, 1);
    }

    public saveDimension(dimension) {
    	if (!this.resource[this.field.name]) this.resource[this.field.name] = [];

    	this.convertInputToMM(dimension);
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