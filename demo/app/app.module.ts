import {
    APP_INITIALIZER,
    LOCALE_ID,
    NgModule,
    TRANSLATIONS,
    TRANSLATIONS_FORMAT
} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {routing} from './app.routing';
import {Datastore} from '../../src/datastore/datastore';
import {Messages} from '../../src/messages/messages';
import {MemoryDatastore} from './memory-datastore';
import {MD} from '../../src/messages/md';
import {M} from './m';
import {MessagesDemoComponent} from './messages-demo.component';
import {MapDemoComponent} from './map-demo.component';
import {AppComponent} from './app.component';
import {IdaiMessagesModule} from '../../src/messages/idai-messages.module';
import {IdaiWidgetsModule} from '../../src/widgets/idai-widgets.module';
import {IdaiFieldMapModule} from '../../src/map/idai-field-map.module';

let pconf: any = undefined;

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        IdaiMessagesModule,
        IdaiWidgetsModule,
        IdaiFieldMapModule,
        routing
    ],
    declarations: [
        AppComponent,
        MessagesDemoComponent,
        MapDemoComponent
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'de' },
        { provide: TRANSLATIONS, useValue: '' },
        { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },

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
        I18n
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
