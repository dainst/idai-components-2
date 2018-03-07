import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing} from './app.routing';
import {Datastore} from "../../src/core/datastore/datastore";
import {DocumentEditChangeMonitor} from "../../src/core/documents/docedit/document-edit-change-monitor";
import {Messages} from "../../src/core/messages/messages";
import {MemoryDatastore} from "./memory-datastore";
import {MD} from "../../src/core/messages/md";
import {M} from "./m";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {DocumentEditDemoComponent} from './document-edit-demo.component';
import {DocumentViewDemoComponent} from "./document-view-demo.component";
import {MessagesDemoComponent} from './messages-demo.component';
import {MapDemoComponent} from './map-demo.component';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {IdaiDocumentsModule} from '../../src/core/documents/idai-documents.module';
import {IdaiMessagesModule} from '../../src/core/messages/idai-messages.module';
import {IdaiWidgetsModule} from '../../src/core/widgets/idai-widgets.module';
import {IdaiFieldMapModule} from '../../src/core/idai-field-map/idai-field-map.module';
import {DocumentEditComponent} from "./document-edit.component";

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
        DocumentEditComponent,
        MapDemoComponent
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: Datastore, useClass: MemoryDatastore },
        { provide: MD, useClass: M },
        {
            provide: Messages,
            useFactory: (md: MD) => {
                return new Messages(md, 3500);
            },
            deps: [MD]
        },
        DocumentEditChangeMonitor
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
