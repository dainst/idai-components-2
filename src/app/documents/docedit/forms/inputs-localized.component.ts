import {Component, Input} from '@angular/core';
import {Resource} from "../../../model/resource";

/**
 * @author Fabian Z.
 */
@Component({
    moduleId: module.id,
    selector: 'dai-inputs-localized',
    template: `<div>
        <ul>
            <li *ngFor="let language of resource[field.name]; let i = index">
                <h4>{{language['lang']}}</h4>
                
                <div *ngIf="field.inner.inputType == 'inputs'">
                    <dai-inputs  [(resource)]="resource[field.name][i]" [fieldName]="'content'"></dai-inputs>
                </div>      
        
            </li>
        </ul>
        <button (click)="addLanguage()">Add Language</button>
    </div>`
})

export class InputsLocalizedComponent {

    @Input() resource: Resource;
    @Input() field: any;


    public languages() : Array<string> {
        if(this.resource[this.field.name] == undefined) {
            return ["de"]
        }
        return this.resource[this.field.name].map(f=>f.lang)
    }

    public addLanguage() {
        var newLocale = prompt("Enter new language");

        if (this.languages().indexOf(newLocale as any) != -1) {
            alert("Locale already included!");
            return;
        }

        if (!Array.isArray(this.resource[this.field.name])) {
            this.resource[this.field.name] = [];
        }
        this.resource[this.field.name].push({"lang" : newLocale, "content": [""]})
        
    }
}