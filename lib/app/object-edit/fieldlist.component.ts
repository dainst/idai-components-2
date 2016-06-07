import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Entity} from "../core-services/entity";
import {PersistenceManager} from "./persistence-manager";

/**
 * @author Daniel de Oliveira
 */
@Component({

    selector: 'fieldlist',
    template: `<div>
        <ul>
            <li *ngFor="let item of object[fieldDefinition.field]">
                <ul>
                    <li *ngFor="let sub of fieldDefinition.fields">
                        <label>{{sub.field}}</label>
                        <input  [(ngModel)]="item[sub.field]" (keyup)="markAsChanged()">
                    </li>
                </ul>
            </li>
            <li>
                <button (click)="addItem()">Add an item</button>
            </li>
        </ul>
    </div>`,
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class FieldlistComponent {

    @Input() object: Entity;
    @Input() fieldDefinition: any;

    constructor(private persistenceManager: PersistenceManager) {}

    public markAsChanged() {
        this.persistenceManager.load(this.object);
    }

    public addItem() {
        if (!this.object[this.fieldDefinition.field]) this.object[this.fieldDefinition.field]=[];

        var newItem={}
        for (var itemDefinition of this.fieldDefinition.fields) {
            newItem[itemDefinition.field]="";
        }

        this.object[this.fieldDefinition.field].push(newItem)
        console.log("item add",this.object)
    }
}