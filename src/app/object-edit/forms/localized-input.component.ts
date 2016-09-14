import {Component, Input} from '@angular/core';

/**
 * @author Daniel de Oliveira
 * @author Fabian Z.
 */
@Component({

    selector: 'dai-localized-input',
    template: `<div>

        <ul>
            <li *ngFor="let language of languages()">
                {{language}}
                
                <div *ngIf="innerInputType == 'dai-inputs'">
                    <dai-inputs [(field)]="field[language]"></dai-inputs>
                </div>      
        
            </li>
        </ul>

    </div>`
})
export class LocalizedInputComponent {

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