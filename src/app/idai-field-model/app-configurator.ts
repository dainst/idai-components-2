import {Injectable} from '@angular/core';
import {ConfigLoader} from '../configuration/config-loader';
import {ConfigurationPreprocessor} from '../configuration/configuration-preprocessor';
import {ConfigurationValidator} from '../configuration/configuration-validator';

@Injectable()
/**
 * @author Daniel de Oliveira
 */
export class AppConfigurator {

    constructor(private configLoader: ConfigLoader) { }

    private defaultTypes = [{
        type: 'Image',
        fields: [
            {
                name: 'height',
                editable: false,
                label: 'Höhe'
            },
            {
                name: 'width',
                editable: false,
                label: 'Breite'
            },
            {
                name : 'originalFilename',
                visible: false,
                editable: false
            },
            // TODO Delete the field 'filename' as soon as existing data has been migrated.
            {
                name : 'filename',
                visible: false,
                editable: false
            },
            {
                name: 'georeference',
                visible: false,
                editable: false
            }
        ]
    }, {
        type: 'Project',
        label: 'Projekt',
        fields: [
            {
                name: 'identifier',
                editable: false
            },
            {
                name: 'coordinateReferenceSystem',
                label: 'Koordinatenbezugssystem',
                inputType: 'dropdown',
                valuelist: [
                    'Eigenes Koordinatenbezugssystem',
                    'EPSG4326 (WGS 84)',
                    'EPSG3857 (WGS 84 Web Mercator)'
                ]
            }
        ]
    }];

    private defaultFields = [{
        name: 'shortDescription',
        label: 'Kurzbeschreibung',
        visible: false
    }, {
        name: 'identifier',
        description: 'Eindeutiger Bezeichner dieser Ressource',
        label: 'Bezeichner',
        visible: false,
        mandatory: true
    }, {
        name: 'geometry',
        visible: false,
        editable: false
    }];

    private defaultRelations = [
        { name: 'depicts', domain: ['Image:inherit'], inverse: 'isDepictedIn', label: 'Zeigt', editable: true },
        { name: 'isDepictedIn', range: ['Image:inherit'], inverse: 'depicts', visible: false, editable: false }
        // isRecordedIn
        // records
    ];

    public go(projectConfigurationPath: string, reset: boolean = false) {

        if (reset) this.configLoader.reset();

        this.configLoader.go(
            projectConfigurationPath,
            new ConfigurationPreprocessor(
                this.defaultTypes,
                this.defaultFields,
                this.defaultRelations)
            ,
            new ConfigurationValidator([])
        );
    }
}