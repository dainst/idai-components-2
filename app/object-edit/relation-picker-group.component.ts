import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Entity} from "../core-services/entity";
import {RelationPickerComponent} from "./relation-picker.component";


/**
 * @author Thomas Kleinke
 */
@Component({

    selector: 'relation-picker-group',
    template: `<div *ngFor="let relation of object[field.field]; let i = index">
    <relation-picker [(object)]="object" [field]="field" [relationIndex]="i"></relation-picker>
</div>
<div class="circular-button add-relation"
     *ngIf="!object[field.field] || object[field.field].length == 0 || validateNewest()"
     type="button"
     (click)="createRelation()">+</div>

<!-- Button disabled when waiting for input -->
<div class="circular-button add-relation-disabled"
     *ngIf="object[field.field] && object[field.field].length > 0 && !validateNewest()"
     type="button">+</div>`,
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES, RelationPickerComponent]
})

export class RelationPickerGroupComponent {

    @Input() object: Entity;
    @Input() field: any;

    public createRelation() {

        if (!this.object[this.field.field]) this.object[this.field.field] = [];

        this.object[this.field.field].push("");
    }

    public validateNewest(): boolean {

        var index: number = this.object[this.field.field].length - 1;

        if (!this.object[this.field.field][index] || this.object[this.field.field][index].length == 0) {
            return false;
        } else {
            return true;
        }
    }

}