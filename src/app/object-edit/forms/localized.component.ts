import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {FieldlistComponent} from "../fieldlist.component";
import {InputArrayComponent} from "./input-array.component";

/**
 * @author Daniel de Oliveira
 * @author Fabian Zavodnik
 */
@Component({

    selector: 'localized',
    template: `<div>

        <ul>
            <li *ngFor="let language of languages()">
                {{language}}
                
                <div *ngIf="innerInputType == 'input/multiple'">
                    <input-array [(field)]="field[language]"></input-array>
                </div>
        
        
            </li>
        </ul>

    </div>`,
    directives: [
        CORE_DIRECTIVES,
        COMMON_DIRECTIVES,
        FORM_DIRECTIVES,
        FieldlistComponent,
        InputArrayComponent
    ]
})
export class LocalizedComponent {

    @Input() field: any;
    @Input() innerInputType: any;

    public languages() : Array<string> {

        if(this.field == undefined) {
            this.field = {
                "de": [
                    ""
                ]
            }
        }
        return Object.keys(this.field);
    }
}