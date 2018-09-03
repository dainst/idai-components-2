import {Injectable} from '@angular/core';
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
        Feature: {
            fields: {
                period: {
                    inputType: "dropdownRange"
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
                    label: 'Höhe'
                },
                width: {
                    editable: false,
                    label: 'Breite'
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
            label: 'Projekt',
            fields: {
                'identifier': {
                    editable: false
                },
                'coordinateReferenceSystem': {
                    label: 'Koordinatenbezugssystem',
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
            label: 'Kurzbeschreibung',
            visible: false
        } as FieldDefinition,
        identifier: {
            description: 'Eindeutiger Bezeichner dieser Ressource',
            label: 'Bezeichner',
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
        { name: 'depicts', domain: ['Image:inherit'],
            inverse: 'isDepictedIn', label: 'Zeigt', editable: true },
        { name: 'isDepictedIn', range: ['Image:inherit'],
            inverse: 'depicts', visible: false, editable: false },

        { name: 'isLocatedIn', domain: ['Operation:inherit'], label: 'Liegt im Ort',
            inverse: 'locates', range: ['Place'] },
        { name: 'locates', domain: ['Place'], label: 'Enthält Maßnahme', inverse: 'isLocatedIn',
            range: ['Operation:inherit'] },

        { name: 'isAfter', inverse: 'isBefore', label: 'Zeitlich nach',
            domain: ['Feature:inherit'], range: ['Feature:inherit'], sameMainTypeResource: true},
        { name: 'isBefore', inverse: 'isAfter', label: 'Zeitlich vor',
            domain: ['Feature:inherit'], range: ['Feature:inherit'], sameMainTypeResource: true},
        { name: 'isContemporaryWith', inverse: 'isContemporaryWith', label: 'Zeitgleich mit',
            domain: ['Feature:inherit'], range: ['Feature:inherit'], sameMainTypeResource: true},

        { name: 'isAbove', inverse: 'isBelow', label: 'Liegt über',
            domain: ['Feature:inherit'], range: ['Feature:inherit'], sameMainTypeResource: true},
        { name: 'isBelow', inverse: 'isAbove', label: 'Liegt unter',
            domain: ['Feature:inherit'], range: ['Feature:inherit'], sameMainTypeResource: true},

        { name: 'cuts', inverse: 'isCutBy', label: 'Schneidet',
            domain: ['Feature:inherit'], range: ['Feature:inherit'], sameMainTypeResource: true},
        { name: 'isCutBy', inverse: 'cuts', label: 'Wird geschnitten von',
            domain: ['Feature:inherit'], range: ['Feature:inherit'], sameMainTypeResource: true},
        { name: 'borders', inverse: 'borders', label: 'Grenzt an',
            domain: ['Feature:inherit'], range: ['Feature:inherit'], sameMainTypeResource: true},

        { name: 'isRecordedIn', label: 'Aufgenommen in Maßnahme',
            domain: ['Feature:inherit', 'Find:inherit', 'Inscription'], range: ['Operation:inherit']},


        { name: 'includes', inverse: 'liesWithin', label: 'Beinhaltet',
            domain: ['Feature:inherit'], range: ['Find:inherit', 'Feature:inherit', 'Inscription'], sameMainTypeResource: true},
        { name: 'includes', inverse: 'liesWithin', label: 'Beinhaltet',
            domain: ['Find:inherit'], range: ['Find:inherit', 'Inscription'], sameMainTypeResource: true},

        { name: 'liesWithin', inverse: 'includes', label: 'Liegt in',
            domain: ['Find:inherit', 'Inscription'], range: ['Feature:inherit'], sameMainTypeResource: true},
        { name: 'liesWithin', inverse: 'includes', label: 'Liegt in',
            domain: ['Feature:inherit'], range: ['Feature:inherit'], sameMainTypeResource: true},


        { name: 'bears', inverse: 'isFoundOn', label: 'trägt',
            domain: ['Find:inherit'], range: ['Inscription'], sameMainTypeResource: true},
        { name: 'isFoundOn', inverse: 'bears', label: 'ist aufgebracht auf',
            domain: ['Inscription'], range: ['Find:inherit'], sameMainTypeResource: true},
    ];


    constructor(private configLoader: ConfigLoader) { }


    public go(configDirPath: string,
              applyMeninxConfiguration: boolean = false): Promise<ProjectConfiguration> {

        return this.configLoader.go(
            configDirPath,
            this.defaultTypes,
            this.defaultRelations,
            this.defaultFields,
            this.defaultFieldsOrder,
            new IdaiFieldPrePreprocessConfigurationValidator(),
            new IdaiFieldConfigurationValidator(),
            applyMeninxConfiguration
        );
    }
}