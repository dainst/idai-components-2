import {NgModule} from '@angular/core';
import {TypeIconComponent} from './type-icon';
import {SearchBarComponent} from './search-bar.component';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        NgbModule
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
