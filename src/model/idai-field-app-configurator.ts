import {Injectable} from '@angular/core';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {ConfigLoader} from '../configuration/config-loader';
import {IdaiFieldConfigurationValidator} from './idai-field-configuration-validator';
import {ProjectConfiguration} from '../configuration/project-configuration';
import {IdaiFieldPrePreprocessConfigurationValidator} from '../configuration/idai-field-pre-preprocess-configuration-validator';
import {TypeDefinition} from '../configuration/type-definition';
import {FieldDefinition} from '../configuration/field-definition';


@Injectable()
/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export class IdaiFieldAppConfigurator {

    private defaultTypes = {
        Place: {
            fields: {
                gazId: {
                    inputType: 'unsignedInt'
                }
            }
        } as TypeDefinition,
        Operation: {
            fields: {},
            abstract: true
        } as TypeDefinition,
        Building: {
            fields: {},
            parent: 'Operation'
        } as TypeDefinition,
        Survey: {
            fields: {},
            parent: 'Operation'
        } as TypeDefinition,
        Trench: {
            fields: {},
            parent: 'Operation'
        } as TypeDefinition,
        Room: {
            fields: {}
        } as TypeDefinition,
        BuildingPart: {
            fields: {}
        } as TypeDefinition,
        SurveyUnit: {
            fields: {}
        } as TypeDefinition,
        Feature: {
            fields: {
                period: {
                    inputType: 'dropdownRange'
                }
            }
        } as TypeDefinition,
        Find: {
            fields: {}
        } as TypeDefinition,
        Inscription: {
            fields: {}
        } as TypeDefinition,
        Image: {
            fields: {
                height: {
                    editable: false,
                    label: this.i18n({ id: 'configuration.image.height', value: 'Höhe' })
                },
                width: {
                    editable: false,
                    label: this.i18n({ id: 'configuration.image.width', value: 'Breite' })
                },
                originalFilename: {
                    visible: false,
                    editable: false
                },
                // TODO Delete the fields 'filename' and 'hasFilename' as soon as existing data has been migrated.
                filename: {
                    visible: false,
                    editable: false
                },
                georeference: {
                    visible: false,
                    editable: false
                }
            }
        } as TypeDefinition,
        Project: {
            label: this.i18n({ id: 'configuration.project', value: 'Projekt' }),
            fields: {
                'identifier': {
                    editable: false
                },
                'coordinateReferenceSystem': {
                    label: this.i18n({ id: 'configuration.project.crs', value: 'Koordinatenbezugssystem' }),
                    inputType: 'dropdown',
                    valuelist: [
                        'Eigenes Koordinatenbezugssystem',
                        'EPSG4326 (WGS 84)',
                        'EPSG3857 (WGS 84 Web Mercator)'
                    ]
                }
            }
        } as TypeDefinition
    };

    private defaultFields = {
        shortDescription: {
            label: this.i18n({ id: 'configuration.defaultFields.shortDescription', value: 'Kurzbeschreibung' }),
            visible: false
        } as FieldDefinition,
        identifier: {
            description: this.i18n({
                id: 'configuration.defaultFields.identifier.description',
                value: 'Eindeutiger Bezeichner dieser Ressource'
            }),
            label: this.i18n({ id: 'configuration.defaultFields.identifier', value: 'Bezeichner' }),
            visible: false,
            mandatory: true
        } as FieldDefinition,
        geometry: {
            visible: false,
            editable: false
        } as FieldDefinition
    };


    private defaultFieldsOrder = [
        'identifier',
        'shortDescription'
    ];


    private defaultRelations = [
        {
            name: 'depicts',
            domain: ['Image:inherit'],
            inverse: 'isDepictedIn',
            label: this.i18n({ id: 'configuration.relations.depicts', value: 'Zeigt' }),
            editable: true
        },
        {
            name: 'isDepictedIn',
            range: ['Image:inherit'],
            inverse: 'depicts',
            label: this.i18n({ id: 'configuration.relations.isDepictedIn', value: 'Wird gezeigt in' }),
            visible: false,
            editable: false
        },
        {
            name: 'isAfter',
            inverse: 'isBefore',
            label: this.i18n({ id: 'configuration.relations.isAfter', value: 'Zeitlich nach' }),
            domain: ['Feature:inherit'],
            range: ['Feature:inherit'],
            sameMainTypeResource: true
        },
        {
            name: 'isBefore',
            inverse: 'isAfter',
            label: this.i18n({ id: 'configuration.relations.isBefore', value: 'Zeitlich vor' }),
            domain: ['Feature:inherit'],
            range: ['Feature:inherit'],
            sameMainTypeResource: true
        },
        {
            name: 'isContemporaryWith',
            inverse: 'isContemporaryWith',
            label: this.i18n({ id: 'configuration.relations.isContemporaryWith', value: 'Zeitgleich mit' }),
            domain: ['Feature:inherit'],
            range: ['Feature:inherit'],
            sameMainTypeResource: true
        },
        {
            name: 'isAbove',
            inverse: 'isBelow',
            label: this.i18n({ id: 'configuration.relations.isAbove', value: 'Liegt über' }),
            domain: ['Feature:inherit'],
            range: ['Feature:inherit'],
            sameMainTypeResource: true
        },
        {
            name: 'isBelow',
            inverse: 'isAbove',
            label: this.i18n({ id: 'configuration.relations.isBelow', value: 'Liegt unter' }),
            domain: ['Feature:inherit'],
            range: ['Feature:inherit'],
            sameMainTypeResource: true
        },
        {
            name: 'cuts',
            inverse: 'isCutBy',
            label: this.i18n({ id: 'configuration.relations.cuts', value: 'Schneidet' }),
            domain: ['Feature:inherit'],
            range: ['Feature:inherit'],
            sameMainTypeResource: true
        },
        {
            name: 'isCutBy',
            inverse: 'cuts',
            label: this.i18n({ id: 'configuration.relations.isCutBy', value: 'Wird geschnitten von' }),
            domain: ['Feature:inherit'],
            range: ['Feature:inherit'],
            sameMainTypeResource: true
        },
        {
            name: 'borders',
            inverse: 'borders',
            label: this.i18n({ id: 'configuration.relations.borders', value: 'Grenzt an' }),
            domain: ['Feature:inherit'],
            range: ['Feature:inherit'],
            sameMainTypeResource: true
        },
        {
            name: 'borders',
            inverse: 'borders',
            label: this.i18n({ id: 'configuration.relations.borders', value: 'Grenzt an' }),
            domain: ['BuildingPart:inherit'],
            range: ['BuildingPart:inherit'],
            sameMainTypeResource: true
        },
        {
            name: 'isRecordedIn',
            label: this.i18n({ id: 'configuration.relations.isRecordedIn', value: 'Aufgenommen in Maßnahme' }),
            domain: ['Inscription'],
            range: ['Trench']
        },
        {
            name: 'isRecordedIn',
            label: this.i18n({ id: 'configuration.relations.isRecordedIn', value: 'Aufgenommen in Maßnahme' }),
            domain: ['Room'],
            range: ['Building']
        },
        {
            name: 'isRecordedIn',
            label: this.i18n({ id: 'configuration.relations.isRecordedIn', value: 'Aufgenommen in Maßnahme' }),
            domain: ['SurveyUnit'],
            range: ['Survey']
        },
        {
            name: 'isRecordedIn',
            label: this.i18n({ id: 'configuration.relations.isRecordedIn', value: 'Aufgenommen in Maßnahme' }),
            domain: ['BuildingPart'],
            range: ['Building', 'Survey']
        },
        {
            name: 'isRecordedIn',
            label: this.i18n({ id: 'configuration.relations.isRecordedIn', value: 'Aufgenommen in Maßnahme' }),
            domain: ['Find:inherit'],
            range: ['Trench', 'Survey']
        },
        {
            name: 'isRecordedIn',
            label: this.i18n({ id: 'configuration.relations.isRecordedIn', value: 'Aufgenommen in Maßnahme' }),
            domain: ['Feature:inherit'],
            range: ['Trench']
        },
        {
            name: 'includes',
            inverse: 'liesWithin',
            label: this.i18n({ id: 'configuration.relations.includes', value: 'Beinhaltet' }),
            domain: ['Place'],
            range: ['Operation:inherit']
        },
        {
            name: 'includes',
            inverse: 'liesWithin',
            label: this.i18n({ id: 'configuration.relations.includes', value: 'Beinhaltet' }),
            domain: ['Feature:inherit'],
            range: ['Find:inherit', 'Feature:inherit', 'Inscription'],
            sameMainTypeResource: true
        },
        {
            name: 'includes',
            inverse: 'liesWithin',
            label: this.i18n({ id: 'configuration.relations.includes', value: 'Beinhaltet' }),
            domain: ['SurveyUnit'],
            range: ['Find:inherit'],
            sameMainTypeResource: true
        },
        {
            name: 'includes',
            inverse: 'liesWithin',
            label: this.i18n({ id: 'configuration.relations.includes', value: 'Beinhaltet' }),
            domain: ['Find:inherit'],
            range: ['Inscription'],
            sameMainTypeResource: true
        },
        {
            name: 'liesWithin',
            inverse: 'includes',
            label: this.i18n({ id: 'configuration.relations.liesWithin', value: 'Liegt in' }),
            domain: ['Operation:inherit'],
            range: ['Place']
        },
        {
            name: 'liesWithin',
            inverse: 'includes',
            label: this.i18n({ id: 'configuration.relations.liesWithin', value: 'Liegt in' }),
            domain: ['Find:inherit'],
            range: ['Feature:inherit', 'SurveyUnit'],
            sameMainTypeResource: true
        },
        {
            name: 'liesWithin',
            inverse: 'includes',
            label: this.i18n({ id: 'configuration.relations.liesWithin', value: 'Liegt in' }),
            domain: ['Inscription'],
            range: ['Feature:inherit', 'Find:inherit'],
            sameMainTypeResource: true
        },
        {
            name: 'liesWithin',
            inverse: 'includes',
            label: this.i18n({ id: 'configuration.relations.liesWithin', value: 'Liegt in' }),
            domain: ['Feature:inherit'],
            range: ['Feature:inherit'],
            sameMainTypeResource: true
        },
        {
            name: 'bears',
            inverse: 'isFoundOn',
            label: this.i18n({ id: 'configuration.relations.bears', value: 'Trägt' }),
            domain: ['Find:inherit'],
            range: ['Inscription'],
            sameMainTypeResource: true
        },
        {
            name: 'isFoundOn',
            inverse: 'bears',
            label: this.i18n({ id: 'configuration.relations.isFoundOn', value: 'Ist aufgebracht auf' }),
            domain: ['Inscription'],
            range: ['Find:inherit'],
            sameMainTypeResource: true
        }
    ];


    constructor(private configLoader: ConfigLoader,
                private i18n: I18n) {}


    public go(configDirPath: string, customConfigurationName: string|undefined,
              locale: string): Promise<ProjectConfiguration> {

        if (customConfigurationName === 'Meninx' || customConfigurationName === 'Pergamon') {

            (this.defaultTypes as any)['Other'] = {
                color: '#CC6600',
                parent: 'Feature',
                fields: {}
            };
        }


        if (customConfigurationName === 'Meninx') {

            (this.defaultTypes as any)['Wall_surface'] = {
                color: '#ffff99',
                fields: {}
            };
            this.defaultRelations.push({
                name: 'isRecordedIn',
                label: this.i18n({ id: 'configuration.relations.isRecordedIn', value: 'Aufgenommen in Maßnahme' }),
                domain: ['Wall_surface'],
                range: ['Trench']
            });
        }


        if (customConfigurationName === 'Pergamon') {

            (this.defaultTypes as any)['ProcessUnit'] = {
                abstract: true,
                color: '#08306b',
                fields: {}
            };
            (this.defaultTypes as any)['Profile'] = {
                color: '#c6dbef',
                parent: 'ProcessUnit',
                fields: {}
            };
            (this.defaultTypes as any)['Sample'] = {
                color: '#9ecae1',
                parent: 'ProcessUnit',
                fields: {}
            };

            this.defaultRelations.push({
                name: 'isRecordedIn',
                label: this.i18n({ id: 'configuration.relations.isRecordedIn', value: 'Aufgenommen in Maßnahme' }),
                domain: ['ProcessUnit'],
                range: ['Trench']
            });

            this.defaultRelations.push({ // override existing definition
                name: 'isRecordedIn',
                label: this.i18n({ id: 'configuration.relations.isRecordedIn', value: 'Aufgenommen in Maßnahme' }),
                domain: ['Stone'],
                range: ['Building', 'Trench', 'Survey']
            });

            this.defaultRelations.push({ // override existing definition
                name: 'isRecordedIn',
                label: this.i18n({ id: 'configuration.relations.isRecordedIn', value: 'Aufgenommen in Maßnahme' }),
                domain: ['Feature:inherit'],
                range: ['Trench', 'Survey', 'Building']
            });
        }


        return this.configLoader.go(
            configDirPath,
            this.defaultTypes,
            this.defaultRelations,
            this.defaultFields,
            this.defaultFieldsOrder,
            new IdaiFieldPrePreprocessConfigurationValidator(),
            new IdaiFieldConfigurationValidator(),
            customConfigurationName,
            locale
        );
    }
}