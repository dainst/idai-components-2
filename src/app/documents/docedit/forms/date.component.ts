import {Component, Input} from '@angular/core';
import {Resource} from "../../../model/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";



@Component({
    selector: 'dai-date',
    template: `<input class="form-control" [firstDayOfWeek]="1" placeholder="dd.mm.yyyy" (change)="setValue()" (click)="d.toggle()" [(ngModel)]="this.resource[this.field.name]" ngbDatepicker #d="ngbDatepicker">`
})

export class DateComponent {

    @Input() resource: Resource;
    @Input() field: any;

    public dateStruct: {year: number, month: number, day: number} = {year: 2017, month: 6, day: 6};

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    
}