import {Component, Input} from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Resource} from '../../../model/resource';
import {DocumentEditChangeMonitor} from '../document-edit-change-monitor';


@Component({
    moduleId: module.id,
    selector: 'dai-date',
    templateUrl: './date.html'
})
export class DateComponent {

    @Input() resource: Resource;
    @Input('field')
    set field(value: any) {

        this._field = value;
        this.dateStruct = this.dateFormatter.parse(this.resource[this._field.name]);
        if (this.resource[this._field.name] && !this.dateStruct) this.dateNotParsed = true;
    }

    public dateStruct: NgbDateStruct;

    public dateNotParsed = false;

    private _field : any;


    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor,
                public dateFormatter: NgbDateParserFormatter) {}


    public update(newValue: any) {

        this.resource[this._field.name] = this.dateFormatter.format(newValue);
        this.dateNotParsed = false;
        this.documentEditChangeMonitor.setChanged();
    }
}