import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Document} from "../core-services/document";
import {PersistenceManager} from "./persistence-manager";
import {FieldlistComponent} from "./fieldlist.component";

/**
 * @author Daniel de Oliveira
 */
@Component({

    selector: 'localized',
    template: `<div>

        <ul>
            <li *ngFor="let language of languages()">
                {{language}}
                
                <fieldlist *ngIf="fieldDefinition.inner.array" [(document)]="document['resource'][fieldDefinition.field]" 
                    [fieldDefinition]="setLang(fieldDefinition.inner,language)"></fieldlist>
                <div *ngIf="!fieldDefinition.inner.array">not implemented</div>
        
            </li>
        </ul>

    </div>`,
    directives: [
        CORE_DIRECTIVES,
        COMMON_DIRECTIVES,
        FORM_DIRECTIVES,
        FieldlistComponent
    ]
})
export class LocalizedComponent {

    @Input() document: any;
    @Input() fieldDefinition: any;

    public setLang(innerFieldDefinition, lang) {
        innerFieldDefinition['field']=lang;
        return innerFieldDefinition;
    }

    public languages() : Array<string> {
        if (!this.document['resource'][this.fieldDefinition.field]) return [];
        return Object.keys(this.document['resource'][this.fieldDefinition.field]);
    }

    constructor(private persistenceManager: PersistenceManager) {}
}