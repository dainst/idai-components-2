import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing} from './app.routing';
import {HTTP_PROVIDERS} from '@angular/http';
import {Datastore} from "../../src/app/datastore/datastore";
import {ReadDatastore} from "../../src/app/datastore/read-datastore";
import {DocumentEditChangeMonitor} from "../../src/app/object-edit/document-edit-change-monitor";
import {Messages} from "../../src/app/core-services/messages";
import {MemoryDatastore} from "./memory-datastore";
import {ConfigLoader} from "../../src/app/object-edit/config-loader";
import {PersistenceManager} from "../../src/app/object-edit/persistence-manager";
import {MD} from "../../src/app/core-services/md";
import {M} from "./m";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {DocumentEditDemoComponent} from './document-edit-demo.component';
import {MessagesDemoComponent} from './messages-demo.component';
import {AppComponent} from './app.component';

@NgModule({
    imports: [
        BrowserModule,
        routing
    ],
    declarations: [
        DocumentEditDemoComponent,
        MessagesDemoComponent
    ],
    providers: [
        HTTP_PROVIDERS,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: Datastore, useClass: MemoryDatastore },
        { provide: ReadDatastore, useExisting: Datastore },
        Messages,
        ConfigLoader,
        PersistenceManager,
        DocumentEditChangeMonitor,
        { provide: MD, useClass: M }
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {};
