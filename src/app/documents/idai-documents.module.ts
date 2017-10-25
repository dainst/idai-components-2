import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Datastore} from '../datastore/datastore';
import {ReadDatastore} from '../datastore/read-datastore';
import {ConfigLoader} from '../configuration/config-loader';
import {PersistenceManager} from '../persist/persistence-manager';
import {DocumentEditComponent} from './docedit/document-edit.component';
import {EditFormComponent} from './docedit/edit-form.component';
import {RelationsFormComponent} from './docedit/relations-form.component';
import {RelationPickerComponent} from './docedit/relation-picker.component';
import {RelationPickerGroupComponent} from './docedit/relation-picker-group.component';
import {CheckboxesComponent} from './docedit/forms/checkboxes.component';
import {DropdownComponent} from './docedit/forms/dropdown.component';
import {InputComponent} from './docedit/forms/input.component';
import {NumberComponent} from './docedit/forms/number.component';
import {DimensionComponent} from './docedit/forms/dimension.component';
import {InputsComponent} from './docedit/forms/inputs.component';
import {InputsLocalizedComponent} from './docedit/forms/inputs-localized.component';
import {MultiselectComponent} from './docedit/forms/multiselect.component';
import {RadioComponent} from './docedit/forms/radio.component';
import {TextComponent} from './docedit/forms/text.component';
import {DatingComponent} from './docedit/forms/dating.component';
import {DateComponent} from './docedit/forms/date.component';
import {FieldsViewComponent} from './docview/fields-view.component';
import {RelationsViewComponent} from './docview/relations-view.component';
import {DocumentViewComponent} from './docview/document-view.component';
import {IdaiWidgetsModule} from '../widgets/idai-widgets.module';
import {BooleanComponent} from './docedit/forms/boolean.component';
import {DocumentTeaserComponent} from './document-teaser.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        IdaiWidgetsModule,
        NgbModule.forRoot()
    ],
    declarations: [
        FieldsViewComponent,
        RelationsViewComponent,
        DocumentEditComponent,
        DocumentViewComponent,
        EditFormComponent,
        RelationsFormComponent,
        RelationPickerComponent,
        RelationPickerGroupComponent,
        CheckboxesComponent,
        BooleanComponent,
        DropdownComponent,
        InputComponent,
        NumberComponent,
        InputsComponent,
        InputsLocalizedComponent,
        MultiselectComponent,
        RadioComponent,
        TextComponent,
        DatingComponent,
        DateComponent,
        DimensionComponent,
        DocumentTeaserComponent
    ],
    providers: [
        ConfigLoader,
        PersistenceManager,
        DecimalPipe,
        { provide: LOCALE_ID, useValue: 'de-DE' }, // change when i18n is implemented
        { provide: ReadDatastore, useExisting: Datastore }
    ],
    exports: [
        DocumentEditComponent,
        FieldsViewComponent,
        RelationsViewComponent,
        RelationsFormComponent,
        EditFormComponent,
        DocumentViewComponent,
        DocumentTeaserComponent
    ]
})
export class IdaiDocumentsModule {}
