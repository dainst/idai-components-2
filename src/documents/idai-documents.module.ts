import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Datastore} from '../datastore/datastore';
import {ReadDatastore} from '../datastore/read-datastore';
import {ConfigLoader} from '../configuration/config-loader';
import {FieldsViewComponent} from './docview/fields-view.component';
import {DocumentTeaserComponent} from './document-teaser.component';
import {IdaiWidgetsModule} from '../widgets/idai-widgets.module';


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
        DocumentTeaserComponent,
    ],
    providers: [
        ConfigLoader,
        DecimalPipe,
        { provide: LOCALE_ID, useValue: 'de-DE' }, // change when i18n is implemented
        { provide: ReadDatastore, useExisting: Datastore },
        I18n
    ],
    exports: [
        FieldsViewComponent,
        DocumentTeaserComponent
    ]
})
export class IdaiDocumentsModule {}
