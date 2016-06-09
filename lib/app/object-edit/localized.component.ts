import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Entity} from "../core-services/entity";
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
                
                <fieldlist *ngIf="fieldDefinition.inner.array" [(object)]="object[fieldDefinition.field]" 
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

    @Input() object: Entity;
    @Input() fieldDefinition: any;

    private setLang(a,lang) {
        a['field']=lang;
        return a;
    }

    private languages() : Array<string> {
        return Object.keys(this.object[this.fieldDefinition.field])
    }

    constructor(private persistenceManager: PersistenceManager) {}
}