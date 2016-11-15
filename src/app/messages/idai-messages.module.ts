import {NgModule} from '@angular/core';
import {MessagesComponent} from './messages.component';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        MessagesComponent,
    ],
    exports: [
        MessagesComponent
    ]
})
export class IdaiMessagesModule {};
