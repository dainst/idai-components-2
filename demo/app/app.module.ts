import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing} from './app.routing';
import {Datastore} from "../../src/ts/core/datastore/datastore";
import {DocumentEditChangeMonitor} from "../../src/ts/core/documents/docedit/document-edit-change-monitor";
import {Messages} from "../../src/ts/core/messages/messages";
import {MemoryDatastore} from "./memory-datastore";
import {MD} from "../../src/ts/core/messages/md";
import {M} from "./m";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {DocumentEditDemoComponent} from './document-edit-demo.component';
import {DocumentViewDemoComponent} from "./document-view-demo.component";
import {MessagesDemoComponent} from './messages-demo.component';
import {MapDemoComponent} from './map-demo.component';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {IdaiDocumentsModule} from '../../src/ts/core/documents/idai-documents.module';
import {IdaiMessagesModule} from '../../src/ts/core/messages/idai-messages.module';
import {IdaiWidgetsModule} from '../../src/ts/core/widgets/idai-widgets.module';
import {IdaiFieldMapModule} from '../../src/ts/idai-field/idai-field-map/idai-field-map.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        IdaiDocumentsModule,
        IdaiMessagesModule,
        IdaiWidgetsModule,
        IdaiFieldMapModule,
        routing
    ],
    declarations: [
        AppComponent,
        DocumentEditDemoComponent,
        DocumentViewDemoComponent,
        MessagesDemoComponent,
        MapDemoComponent
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
