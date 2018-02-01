import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgbModule, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {Datastore} from '../datastore/datastore';
import {ReadDatastore} from '../datastore/read-datastore';
import {ConfigLoader} from '../configuration/config-loader';
import {DocumentEditComponent} from '../../../demo/app/document-edit.component';
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
import {NgbDateDEParserFormatter} from './docedit/forms/date-formatter.component';
import {FieldsViewComponent} from './docview/fields-view.component';
import {RelationsViewComponent} from './docview/relations-view.component';
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
        DecimalPipe,
        { provide: LOCALE_ID, useValue: 'de-DE' }, // change when i18n is implemented
        { provide: ReadDatastore, useExisting: Datastore },
        { provide: NgbDateParserFormatter, useClass: NgbDateDEParserFormatter }
    ],
    exports: [
        FieldsViewComponent,
        RelationsViewComponent,
        RelationsFormComponent,
        EditFormComponent,
        DocumentTeaserComponent
    ]
})
export class IdaiDocumentsModule {}
