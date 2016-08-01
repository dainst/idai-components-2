import {Component, Input, OnChanges} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Resource} from "../core-services/resource";
import {RelationPickerComponent} from "./relation-picker.component";


/**
 * @author Thomas Kleinke
 */
@Component({

    selector: 'relation-picker-group',
    templateUrl: 'src/templates/relation-picker-group.html',
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES, RelationPickerComponent]
})

export class RelationPickerGroupComponent implements OnChanges {

    @Input() document: any;
    @Input() field: any;
    @Input() primary: string;

    public resource: Resource;
    
    public ngOnChanges() {
        
        if (this.document)
            this.resource = this.document['resource'];
    }
    
    public createRelation() {

        if (!this.resource[this.field.name]) this.resource[this.field.name] = [];
    
        this.resource[this.field.name].push("")
    }
    
    public validateNewest(): boolean {
    
        var index: number = this.resource[this.field.name].length - 1;
    
        if (!this.resource[this.field.name][index] || this.resource[this.field.name][index].length == 0) {
            return false;
        } else {
            return true;
        }
    }
}