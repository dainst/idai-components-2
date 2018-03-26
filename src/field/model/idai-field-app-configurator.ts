import {Injectable} from '@angular/core';
import {ConfigLoader} from '../../core/configuration/config-loader';
import {IdaiFieldConfigurationValidator} from './idai-field-configuration-validator';
import {ProjectConfiguration} from '../../core/configuration/project-configuration';
import {IdaiFieldPrePreprocessConfigurationValidator} from '../../core/configuration/idai-field-pre-prepprocess-configuration-validator';


@Injectable()
/**
 * @author Daniel de Oliveira
 */
export class IdaiFieldAppConfigurator {

    private defaultTypes = [
    {
        type: 'Place',
        fields: []
    },
    {
        type: 'Operation',
        fields: [],
        abstract: true
    },
    {
       type: 'Feature',
       fields: []
    },
    {
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
            // TODO Delete the fields 'filename' and 'hasFilename' as soon as existing data has been migrated.
            {
                name : 'filename',
                visible: false,
                editable: false
            },
            {
                name : 'hasFilename',
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
        { name: 'depicts', domain: ['Image:inherit'],
            inverse: 'isDepictedIn', label: 'Zeigt', editable: true },
        { name: 'isDepictedIn', range: ['Image:inherit'],
            inverse: 'depicts', visible: false, editable: false },
        { name: 'isRecordedIn', domain: ['Operation:inherit'], label: "Gehört zu",
            range: ['Project'], visible: false, editable: false },
        { name: 'isRecordedIn', domain: ['Place'], label: "Gehört zu",
            range: ['Project'], visible: false, editable: false },
        { name: "liesWithin", domain: ["Operation:inherit"], label: "Liegt in",
            inverse: "includes", range: ["Place"], sameMainTypeResource: true },
        { name: "includes", domain: ["Place"], label: "Enthält", inverse: "liesWithin",
            range: ["Operation:inherit"], sameMainTypeResource: true },
        { name: "isAfter", inverse: "isBefore", label: "Zeitlich nach",
            domain: ["Feature:inherit"], range: ["Feature:inherit"]},
        { name: "isBefore", inverse: "isAfter", label: "Zeitlich vor",
            domain: ["Feature:inherit"], range: ["Feature:inherit"]},
        { name: "isContemporaryWith", inverse: "isContemporaryWith", label: "Zeitgleich mit",
            domain: ["Feature:inherit"], range: ["Feature:inherit"]},
    ];


    constructor(private configLoader: ConfigLoader) { }


    public go(configDirPath: string): Promise<ProjectConfiguration> {

        return this.configLoader.go(
            configDirPath,
            this.defaultTypes,
            this.defaultRelations,
            this.defaultFields,
            new IdaiFieldPrePreprocessConfigurationValidator(),
            new IdaiFieldConfigurationValidator()
        );
    }
}