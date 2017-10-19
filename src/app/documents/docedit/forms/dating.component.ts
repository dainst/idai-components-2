import {Component, Input, OnInit} from '@angular/core';
import {Resource} from "../../../model/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";

/**
 * @author Sebastian Cuy
 */
@Component({
    moduleId: module.id,
    selector: 'dai-dating',
    templateUrl: './dating.html'
})

export class DatingComponent {

    // TODO: use this map in template as well
    public DATE_TYPES = {
        "bce": "v.Chr.",
        "ce": "n.Chr.",
        "bp": "BP"
    }

    @Input() resource: Resource;
    @Input() field: any;

    public newDating: {} = null;

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {}

    public removeDating(i:number): void {
        this.resource[this.field.name].splice(i, 1);
    }

    public createNewDating(): void {
        this.newDating = {
            type: 'range',
            dates: [{ value: 0, type: 'bce' }, { value: 0, type: 'bce' }]
        };
    }

    public addNewDating(): void {
        if (!this.resource[this.field.name])
            this.resource[this.field.name] = [];
        this.resource[this.field.name].push(this.convertDating(this.newDating));
        this.newDating = null;
    }

    public convertDating(dating): any {

        for (let date of dating.dates) {
            if (date.value < 0) return false;
        }
        let converted = this.createNormalizedDating(dating);
        if (dating.type != 'scientific'
                && converted['hasBegin']
                && converted['hasEnd'])
            if (converted['hasBegin']['year'] > converted['hasEnd']['year'])
                return false;

        if (dating.type == 'scientific' && dating.margin > 0) {
            converted['hasEnd']['year'] = converted['hasBegin']['year'] + dating.margin;
            converted['hasBegin']['year'] -= dating.margin;
        }

        if (dating['hasSource']) converted['hasSource'] = dating['hasSource'];
        if (dating['isImprecise']) converted['isImprecise'] = true;
        if (dating['isUncertain']) converted['isUncertain'] = true;

        converted['hasLabel'] = this.generateLabel(dating);

        return converted;
    }

    private createNormalizedDating(dating) {
        let normalized = {};
        if (dating.type != 'before')
            normalized['hasBegin'] = { year: this.normalizeDate(dating.dates[0]) };
        if (dating.type != 'after')
            normalized['hasEnd'] = { year: this.normalizeDate(dating.dates[1]) };
        if (dating.type == 'exact')
            normalized['hasEnd'] = { year: this.normalizeDate(dating.dates[0]) };
        return normalized;
    }

    private normalizeDate(date) {
        if (date.type == 'bce') return 0 - date.value;
        if (date.type == 'bp') return 1950 - date.value;
        return date.value;
    }

    private generateLabel(dating): string {

        let prefix = '';
        let year = '';
        let postfix = '';

        if (dating.type == 'range')
            year = this.generateLabelForDate(dating.dates[0])
                + ' – ' + this.generateLabelForDate(dating.dates[1]);
        if (dating.type == 'before')
            year = this.generateLabelForDate(dating.dates[1]);
        if (dating.type == 'after' || dating.type == 'exact')
            year = this.generateLabelForDate(dating.dates[0]);
        if (dating.type == 'scientific') {
            year = this.generateLabelForDate(dating.dates[0]);
            if (dating.margin > 0)
                year += ' ± ' + dating.margin;
        }

        if (dating['isImprecise']) prefix = 'ca. ';
        if (dating['isUncertain']) postfix = ' (?)';

        if (dating.type == 'before') prefix = 'Vor ' + prefix;
        if (dating.type == 'after') prefix = 'Nach ' + prefix;

        if (dating['hasSource']) postfix += ' [' + dating['hasSource'] + ']';

        return prefix + year + postfix;
    }

    private generateLabelForDate(date): string {
        if (date.value == 0) return "0";
        else return date.value + " " + this.DATE_TYPES[date.type];
    }

}