import {Component, Input, Output, EventEmitter} from '@angular/core';
import {IdaiType} from '../configuration/idai-type';

@Component({
    selector: 'type-picker',
    moduleId: module.id,
    templateUrl: './type-picker.html'
})

/**
 * @author Thomas Kleinke
 */
export class TypePickerComponent {

    @Input() typesTreeList: Array<IdaiType>;
    @Input() selectedTypes: Array<IdaiType>;
    @Input() allTypesOptionVisible: boolean = false;

    @Output() onTypePicked: EventEmitter<IdaiType> = new EventEmitter<IdaiType>();

    public pickType(type: IdaiType) {

        if (type && type.isAbstract) return;

        this.onTypePicked.emit(type);
    }
}