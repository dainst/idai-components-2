import {Component, Input, OnChanges} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Document} from "../core-services/document";
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
    
        if (!this.resource[this.field.field]) this.resource[this.field.field] = [];
    
        this.resource[this.field.field].push("");
    }
    
    public validateNewest(): boolean {
    
        var index: number = this.resource[this.field.field].length - 1;
    
        if (!this.resource[this.field.field][index] || this.resource[this.field.field][index].length == 0) {
            return false;
        } else {
            return true;
        }
    }
}