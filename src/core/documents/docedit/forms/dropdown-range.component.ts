import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Resource} from '../../../model/resource';
import {DocumentEditChangeMonitor} from '../document-edit-change-monitor';


@Component({
    moduleId: module.id,
    selector: 'dai-dropdown-range',
    templateUrl: './dropdown-range.html'
})

/**
 * @author Sebastian Cuy
 * @author Daniel de Oliveira
 */
export class DropdownRangeComponent implements OnChanges {

    public activateHasPeriodEnd = () => this.hasPeriodEndActivated = true;

    public hasPeriodEndActivated: boolean = false;

    @Input() resource: Resource;
    @Input() field: any;


    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}


    ngOnChanges(changes: SimpleChanges): void {

        // TODO this can be removed when the existing data has been adjusted via script
        if (this.resource && this.resource['hasPeriodBeginning']) {
            this.resource['hasPeriod'] = this.resource['hasPeriodBeginning'];
            delete this.resource['hasPeriodBeginning'];
        }
    }


    public showPeriodEndElements() {

        return this.hasPeriodEndActivated
            || (this.resource['hasPeriodEnd'] && this.resource['hasPeriodEnd'] !== '');
    }


    public setValue(value: any) {

        if (value === undefined || value === '') {
            this.hasPeriodEndActivated = false;
            delete this.resource['hasPeriod'];
            this.resource['hasPeriodEnd'] = undefined;
        }
        this.documentEditChangeMonitor.setChanged();
    }


    public setEndValue(value: any) {

        if (value === undefined || value === '') {
            this.hasPeriodEndActivated = false;
            this.resource['hasPeriodEnd'] = undefined;
        } else {
            this.resource['hasPeriodEnd'] = value;
        }
        this.documentEditChangeMonitor.setChanged();
    }
}