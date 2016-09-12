import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing} from './app.routing';
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
import {DocumentEditComponent} from '../../src/app/object-edit/document-edit.component';
import {EditFormComponent} from '../../src/app/object-edit/edit-form.component';
import {RelationsFormComponent} from '../../src/app/object-edit/relations-form.component';
import {RelationPickerComponent} from '../../src/app/object-edit/relation-picker.component';
import {RelationPickerGroupComponent} from '../../src/app/object-edit/relation-picker-group.component';
import {CheckboxesComponent} from '../../src/app/object-edit/forms/checkboxes.component';
import {DropdownComponent} from '../../src/app/object-edit/forms/dropdown.component';
import {InputComponent} from '../../src/app/object-edit/forms/input.component';
import {InputsComponent} from '../../src/app/object-edit/forms/inputs.component';
import {LocalizedComponent} from '../../src/app/object-edit/forms/localized.component';
import {MultiselectComponent} from '../../src/app/object-edit/forms/multiselect.component';
import {RadioComponent} from '../../src/app/object-edit/forms/radio.component';
import {TextComponent} from '../../src/app/object-edit/forms/text.component';
import {MessagesComponent} from '../../src/app/core-services/messages.component';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing
    ],
    declarations: [
        AppComponent,
        DocumentEditDemoComponent,
        MessagesDemoComponent,
        DocumentEditComponent,
        MessagesComponent,
        EditFormComponent,
        RelationsFormComponent,
        RelationPickerComponent,
        RelationPickerGroupComponent,
        CheckboxesComponent,
        DropdownComponent,
        InputComponent,
        InputsComponent,
        LocalizedComponent,
        MultiselectComponent,
        RadioComponent,
        TextComponent
    ],
    providers: [
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
