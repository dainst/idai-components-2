import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Document} from "../core-services/document";
import {PersistenceManager} from "./persistence-manager";

/**
 * @author Daniel de Oliveira
 */
@Component({

    selector: 'fieldlist',
    template: `<div>
        <ul>
            <li *ngFor="let item of document['resource'][fieldDefinition.field]; let i=index">
                <div>{{item}}</div>
            </li>
      
        </ul>
    </div>`,
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class FieldlistComponent {

    @Input() document: any;
    @Input() fieldDefinition: any;

    constructor(private persistenceManager: PersistenceManager) {}

    public markAsChanged() {
        this.persistenceManager.load(this.document);
    }
}