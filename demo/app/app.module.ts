import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing} from './app.routing';
import {Datastore} from "../../src/app/datastore/datastore";
import {DocumentEditChangeMonitor} from "../../src/app/documents/document-edit-change-monitor";
import {Messages} from "../../src/app/messages/messages";
import {MemoryDatastore} from "./memory-datastore";
import {MD} from "../../src/app/messages/md";
import {M} from "./m";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {DocumentEditDemoComponent} from './document-edit-demo.component';
import {DocumentViewDemoComponent} from "./document-view-demo.component";
import {MessagesDemoComponent} from './messages-demo.component';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {IdaiDocumentsModule} from '../../src/app/documents/idai-documents.module';
import {IdaiMessagesModule} from '../../src/app/messages/idai-messages.module';
import {IdaiWidgetsModule} from '../../src/app/widgets/idai-widgets.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        IdaiDocumentsModule,
        IdaiMessagesModule,
        IdaiWidgetsModule,
        routing,
    ],
    declarations: [
        AppComponent,
        DocumentEditDemoComponent,
        DocumentViewDemoComponent,
        MessagesDemoComponent
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
export class AppModule {}
