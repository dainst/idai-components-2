import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TypeIconComponent} from './type-icon';
import {SearchBarComponent} from './search-bar.component';
import {TypePickerComponent} from './type-picker.component';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    declarations: [
        SearchBarComponent,
        TypeIconComponent,
        TypePickerComponent
    ],
    exports: [
        SearchBarComponent,
        TypeIconComponent,
        TypePickerComponent
    ]
})
export class IdaiWidgetsModule {};
