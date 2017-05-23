import {NgModule} from '@angular/core';
import {MapComponent} from './map.component';
import {MapState} from './map-state';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        MapComponent
    ],
    providers: [
        MapState
    ],
    exports: [
        MapComponent
    ]
})
export class IdaiFieldMapModule {};
