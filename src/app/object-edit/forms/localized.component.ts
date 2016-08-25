import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {InputsComponent} from "./inputs.component";

/**
 * @author Daniel de Oliveira
 * @author Fabian Z.
 */
@Component({

    selector: 'localized',
    template: `<div>

        <ul>
            <li *ngFor="let language of languages()">
                {{language}}
                
                <div *ngIf="innerInputType == 'string_inputs'">
                    <string_inputs [(field)]="field[language]"></string_inputs>
                </div>
        
        
            </li>
        </ul>

    </div>`,
    directives: [
        CORE_DIRECTIVES,
        COMMON_DIRECTIVES,
        FORM_DIRECTIVES,
        InputsComponent
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