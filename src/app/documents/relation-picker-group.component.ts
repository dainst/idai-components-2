import {Component, Input, OnChanges} from '@angular/core';

/**
 * @author Thomas Kleinke
 */
@Component({
    moduleId: module.id,
    selector: 'relation-picker-group',
    templateUrl: './relation-picker-group.html'
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