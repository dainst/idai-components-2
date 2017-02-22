import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Datastore} from "../datastore/datastore";
import {ReadDatastore} from "../datastore/read-datastore";
import {ConfigLoader} from "../configuration/config-loader";
import {PersistenceManager} from "../persist/persistence-manager";
import {DocumentEditComponent} from './document-edit.component';
import {EditFormComponent} from './edit-form.component';
import {RelationsFormComponent} from './relations-form.component';
import {RelationPickerComponent} from './relation-picker.component';
import {RelationPickerGroupComponent} from './relation-picker-group.component';
import {CheckboxesComponent} from './forms/checkboxes.component';
import {DropdownComponent} from './forms/dropdown.component';
import {InputComponent} from './forms/input.component';
import {InputsComponent} from './forms/inputs.component';
import {InputsLocalizedComponent} from './forms/inputs-localized.component';
import {MultiselectComponent} from './forms/multiselect.component';
import {RadioComponent} from './forms/radio.component';
import {TextComponent} from './forms/text.component';
import {FormsModule} from '@angular/forms';
import {FieldsViewComponent} from "./fields-view.component";
import {RelationsViewComponent} from "./relations-view.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        FieldsViewComponent,
        RelationsViewComponent,
        DocumentEditComponent,
        EditFormComponent,
        RelationsFormComponent,
        RelationPickerComponent,
        RelationPickerGroupComponent,
        CheckboxesComponent,
        DropdownComponent,
        InputComponent,
        InputsComponent,
        InputsLocalizedComponent,
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
        FieldsViewComponent,
        RelationsViewComponent,
        RelationsFormComponent,
        EditFormComponent
    ]
})
export class IdaiDocumentsModule {};
