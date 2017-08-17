import {Component, Input} from '@angular/core';
import {Resource} from "../../model/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Fabian Z
 */
@Component({

    selector: 'dai-number',
    template: `<input [(ngModel)]="_value" (blur)="markAsChanged()" class="form-control"><span [hidden]="valid" class="text-danger"><b>Invalid</b></span>`
})

export class NumberComponent {
	_fieldName : string;
    _value : any;
    valid = true;

    @Input() resource: Resource;
    @Input() inputType: string;
    @Input('fieldName')
	set fieldName(value: string) {
		this._fieldName = value;
		this._value = this.resource[value];
	}

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {
    }


    public markAsChanged() {
        if (!this._value || this._value == "") return;

    	if (this.inputType == 'unsignedInt') {
    		this.valid = this._value >>> 0 === parseFloat(this._value)
    	} else {
    		if (isNaN(this._value)) {
	    		this._value = this._value.replace(',','.');
	    	}
    		
	    	if (this.inputType == 'unsignedFloat') {
	    		this.valid = 0 <= (this._value = parseFloat(this._value))
	    	}
	    	if (this.inputType == 'float') {
	    		this.valid = !isNaN(this._value = parseFloat(this._value))
	    	}
    	}

    	if (this.valid) {
    		this.resource[this._fieldName] = this._value
        	this.documentEditChangeMonitor.setChanged();
    	} else {
    		this._value = this.resource[this._fieldName]
    		setTimeout(() => {
    			this.valid = true
    		}, 1500)
    	}
    }
}