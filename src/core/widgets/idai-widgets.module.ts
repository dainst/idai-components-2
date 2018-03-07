import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TypeIconComponent} from './type-icon';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    declarations: [
        TypeIconComponent
    ],
    exports: [
        TypeIconComponent
    ]
})
export class IdaiWidgetsModule {}
