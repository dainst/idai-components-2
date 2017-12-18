import {Component, Input} from '@angular/core';
import {Resource} from '../../../model/resource';
import {DocumentEditChangeMonitor} from '../document-edit-change-monitor';


@Component({
    moduleId: module.id,
    selector: 'dai-number',
    templateUrl: './number.html'
})

/**
 * @author Fabian Z
 */
export class NumberComponent {

    @Input() resource: Resource;
    @Input() inputType: string;
    @Input('fieldName')
    set fieldName(value: string) {
        this._fieldName = value;
        this.value = this.resource[value];
    }

	private _fieldName: string;
    private value: any;
    private valid: boolean = true;


    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {
    }


    public markAsChanged() {

        if (!this.value || this.value == '') return;

    	if (this.inputType == 'unsignedInt') {
    		this.valid = this.value >>> 0 === parseFloat(this.value);
    	} else {
    		if (isNaN(this.value)) {
	    		this.value = this.value.replace(',', '.');
	    	}
    		
	    	if (this.inputType == 'unsignedFloat') {
	    		this.valid = 0 <= (this.value = parseFloat(this.value));
	    	}
	    	if (this.inputType == 'float') {
	    		this.valid = !isNaN(this.value = parseFloat(this.value));
	    	}
    	}

    	if (this.valid) {
    		this.resource[this._fieldName] = this.value;
        	this.documentEditChangeMonitor.setChanged();
    	} else {
    		this.value = this.resource[this._fieldName];
    		setTimeout(() => {
    			this.valid = true
    		}, 1500)
    	}
    }
}