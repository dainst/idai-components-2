import {Injectable} from '@angular/core';
import {ConfigLoader} from '../../core/configuration/config-loader';
import {IdaiFieldConfigurationValidator} from './idai-field-configuration-validator';
import {ProjectConfiguration} from '../../core/configuration/project-configuration';
import {IdaiFieldPrePreprocessConfigurationValidator} from '../../core/configuration/idai-field-pre-preprocess-configuration-validator';
import {TypeDefinition} from '../../core/configuration/type-definition';
import {FieldDefinition} from '../../core/configuration/field-definition';


@Injectable()
/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export class IdaiFieldAppConfigurator {

    private defaultTypes = {
        Place: {
            fields: {
                hasGazId: {
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
                hasDating: {
                    inputType: "dating"
                }
            }
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
                hasFilename: {
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