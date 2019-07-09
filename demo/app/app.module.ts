import {APP_INITIALIZER, LOCALE_ID, NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT} from '@angular/core';
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
import {ProjectConfiguration} from '../../src/configuration/project-configuration';
import {ConfigLoader} from '../../src/configuration/config-loader';
import {ConfigReader} from '../../src/configuration/config-reader';
import {PrePreprocessConfigurationValidator} from '../../src/configuration/pre-preprocess-configuration-validator';
import {ConfigurationValidator} from '../../src/configuration/configuration-validator';
import {IdaiFieldMapModule} from '../../src/map/idai-field-map.module';
import {TypeDefinition} from '../../src/configuration/type-definition';
import {FieldDefinition} from '../../src/configuration/field-definition';

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
        ConfigReader,
        ConfigLoader,
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [ConfigLoader],
            useFactory: (configLoader: ConfigLoader) => () => {
                return configLoader.go(
                    'demo/config',
                    { 'processor': { 'inputType': 'input' }},
                    { 'Image': { 'fields': { 'dimensions': {} } } as TypeDefinition },
                    [
                        {
                            'domain': [
                                'Section'
                            ],
                            'inverse': 'NO-INVERSE',
                            'name': 'isRecordedIn',
                            'range': [
                                'Object'
                            ]
                        },
                        {
                            'name': 'Belongs to',
                            'inverse': 'Includes',
                            'domain': ['Object', 'Object_enhanced', 'Section'],
                            'range': ['Object', 'Object_enhanced', 'Section']
                        },
                        {
                            'name': 'Includes',
                            'inverse': 'Belongs to',
                            'domain': ['Object', 'Object_enhanced', 'Section'],
                            'range': ['Object', 'Object_enhanced', 'Section']
                        },
                        {
                            'name': 'Found in',
                            'inverse': 'Find spot of',
                            'domain': ['Object', 'Object_enhanced'],
                            'range': ['Section']
                        },
                        {
                            'name': 'Find spot of',
                            'inverse': 'Found in',
                            'domain': ['Section'],
                            'range': ['Object', 'Object_enhanced']
                        },
                        { name: 'depicts', domain: ['Image:inherit'], inverse: 'isDepictedBy', visible: false,
                            editable: false},
                        { name: 'isDepictedBy', range: ['Image:inherit'], inverse: 'depicts', visible: false,
                            editable: false}
                    ],{
                        'identifier': {} as FieldDefinition,
                        'shortDescription': {} as FieldDefinition
                    },
                    new PrePreprocessConfigurationValidator(),
                    new ConfigurationValidator(),
                    undefined,
                    'de'
                )
                .then((projectConfiguration: ProjectConfiguration) => pconf = projectConfiguration)
                .catch((msgsWithParams: any) =>{
                    console.error(msgsWithParams);
                });
            }
        },
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
        {
            provide: ProjectConfiguration,
            useFactory: () => {
                if (!pconf) {
                    console.error('pconf has not yet been provided');
                    throw 'pconf has not yet been provided';
                }
                return pconf;
            },
            deps: []
        },
        I18n
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
