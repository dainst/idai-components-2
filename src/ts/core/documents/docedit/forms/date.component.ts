import {Component, Input} from '@angular/core';
import {Resource} from "../../../model/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'dai-date',
    template: `<input class="form-control" [firstDayOfWeek]="1" placeholder="dd.mm.yyyy" (click)="d.toggle()" (ngModelChange)="update($event)" [(ngModel)]="dateStruct" ngbDatepicker #d="ngbDatepicker">`
})

export class DateComponent {
    @Input() resource: Resource;
    dateStruct: NgbDateStruct;

    _field : any;
    @Input('field')
        set field(value: any) {
            this._field = value;
            this.dateStruct = this.dateFormatter.parse(this.resource[this._field.name])
        }

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor, public dateFormatter: NgbDateParserFormatter) { }

    public update(new_value) {
        this.resource[this._field.name] = this.dateFormatter.format(new_value);
        this.documentEditChangeMonitor.setChanged();
    }
}