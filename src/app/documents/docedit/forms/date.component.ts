import {Component, Input} from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Resource} from '../../../model/resource';
import {DocumentEditChangeMonitor} from '../document-edit-change-monitor';


@Component({
selector: 'dai-date',
    template: `<input class="form-control" [firstDayOfWeek]="1" placeholder="dd.mm.yyyy"
                      (click)="d.toggle()" (ngModelChange)="update($event)" [(ngModel)]="dateStruct"
                      ngbDatepicker #d="ngbDatepicker">`
})

export class DateComponent {

    @Input() resource: Resource;
    @Input('field')
    set field(value: any) {
        this._field = value;
        this.dateStruct = this.dateFormatter.parse(this.resource[this._field.name])
    }

    public dateStruct: NgbDateStruct;

    private _field : any;


    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor,
                public dateFormatter: NgbDateParserFormatter) {}


    public update(newValue: any) {

        this.resource[this._field.name] = this.dateFormatter.format(newValue);
        this.documentEditChangeMonitor.setChanged();
    }
}