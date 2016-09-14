import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Datastore} from "./datastore/datastore";
import {ReadDatastore} from "./datastore/read-datastore";
import {ConfigLoader} from "./object-edit/config-loader";
import {PersistenceManager} from "./object-edit/persistence-manager";
import {DocumentEditComponent} from './object-edit/document-edit.component';
import {EditFormComponent} from './object-edit/edit-form.component';
import {RelationsFormComponent} from './object-edit/relations-form.component';
import {RelationPickerComponent} from './object-edit/relation-picker.component';
import {RelationPickerGroupComponent} from './object-edit/relation-picker-group.component';
import {CheckboxesComponent} from './object-edit/forms/checkboxes.component';
import {DropdownComponent} from './object-edit/forms/dropdown.component';
import {InputComponent} from './object-edit/forms/input.component';
import {InputsComponent} from './object-edit/forms/inputs.component';
import {LocalizedInputComponent} from './object-edit/forms/localized-input.component';
import {MultiselectComponent} from './object-edit/forms/multiselect.component';
import {RadioComponent} from './object-edit/forms/radio.component';
import {TextComponent} from './object-edit/forms/text.component';
import {MessagesComponent} from './core-services/messages.component';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
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
        LocalizedInputComponent,
        MultiselectComponent,
        RadioComponent,
        TextComponent
    ],
    providers: [
        ConfigLoader,
        PersistenceManager,
        { provide: ReadDatastore, useExisting: Datastore }
    ],
    exports: [
        DocumentEditComponent,
        MessagesComponent
    ]
})
export class IdaiComponents2Module {};
