import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Resource} from "../core-services/resource";
import {LoadAndSaveService} from "./load-and-save-service";

/**
 * @author Thomas Kleinke
 */
@Component({

    selector: 'valuelist',
    template: `<div>
    <select (change)="setValues($event.target.selectedOptions)" class="form-control" multiple>
        <option *ngFor="let item of field.valuelist" value="{{item}}" [selected]="isSelected(item)">{{item}}</option>
    </select>
</div>`,
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class ValuelistComponent {

    @Input() document: any;
    @Input() field: any;

    public resource: Resource;

    constructor(private loadAndSaveService: LoadAndSaveService) {}

    public ngOnChanges() {
        
        if (this.document)
            this.resource = this.document['resource'];
    }

    public setValues(selectedOptions: HTMLCollection) {
    
        this.resource[this.field.field] = [];
        for (var i = 0; i < selectedOptions.length; i++) {
            this.resource[this.field.field].push(selectedOptions.item(i).childNodes[0].nodeValue);
        }
        this.loadAndSaveService.setChanged();
    }
    
    public isSelected(item: string) {
    
        if (this.resource[this.field.field])
            return (this.resource[this.field.field].indexOf(item) > -1);
        else
            return false;
    }

}