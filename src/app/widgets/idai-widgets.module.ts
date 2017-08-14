import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TypeIconComponent} from './type-icon';
import {SearchBarComponent} from './search-bar.component';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    declarations: [
        SearchBarComponent,
        TypeIconComponent
    ],
    exports: [
        SearchBarComponent,
        TypeIconComponent
    ]
})
export class IdaiWidgetsModule {};
