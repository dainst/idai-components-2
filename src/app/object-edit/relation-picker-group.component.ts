import {Component, Input, OnChanges} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
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

    public relations: any;
    
    public ngOnChanges() {
        
        if (this.document) 
            this.relations = this.document['resource']['relations'];
    }
    
    public createRelation() {

        if (!this.relations[this.field.name])
            this.relations[this.field.name] = [];
    
        this.relations[this.field.name].push("")
    }
    
    public validateNewest(): boolean {
    
        var index: number = this.relations[this.field.name].length - 1;
    
        if (!this.relations[this.field.name][index] || this.relations[this.field.name][index].length == 0) {
            return false;
        } else {
            return true;
        }
    }
}