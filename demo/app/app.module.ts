import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing} from './app.routing';
import {Datastore} from "../../src/app/datastore/datastore";
import {DocumentEditChangeMonitor} from "../../src/app/object-edit/document-edit-change-monitor";
import {Messages} from "../../src/app/core-services/messages";
import {MemoryDatastore} from "./memory-datastore";
import {MD} from "../../src/app/core-services/md";
import {M} from "./m";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {DocumentEditDemoComponent} from './document-edit-demo.component';
import {MessagesDemoComponent} from './messages-demo.component';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {IdaiComponents2Module} from '../../src/app/idai-components-2.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        IdaiComponents2Module,
        routing,
    ],
    declarations: [
        AppComponent,
        DocumentEditDemoComponent,
        MessagesDemoComponent,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: Datastore, useClass: MemoryDatastore },
        Messages,
        { provide: MD, useClass: M },
        DocumentEditChangeMonitor
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {};
