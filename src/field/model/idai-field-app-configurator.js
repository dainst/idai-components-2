"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var config_loader_1 = require("../../core/configuration/config-loader");
var configuration_preprocessor_1 = require("../../core/configuration/configuration-preprocessor");
var idai_field_configuration_validator_1 = require("./idai-field-configuration-validator");
var IdaiFieldAppConfigurator = (function () {
    function IdaiFieldAppConfigurator(configLoader) {
        this.configLoader = configLoader;
        this.defaultTypes = [
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
                        name: 'originalFilename',
                        visible: false,
                        editable: false
                    },
                    // TODO Delete the fields 'filename' and 'hasFilename' as soon as existing data has been migrated.
                    {
                        name: 'filename',
                        visible: false,
                        editable: false
                    },
                    {
                        name: 'hasFilename',
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
            }
        ];
        this.defaultFields = [{
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
        this.defaultRelations = [
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
            { name: "isAfter", inverse: "isBefore",
                domain: ["Feature:inherit"], range: ["Feature:inherit"] },
            { name: "isBefore", inverse: "isAfter",
                domain: ["Feature:inherit"], range: ["Feature:inherit"] },
            { name: "isContemporaryWith", inverse: "isContemporaryWith",
                domain: ["Feature:inherit"], range: ["Feature:inherit"] },
        ];
    }
    IdaiFieldAppConfigurator.prototype.go = function (appConfigurationPath, hiddenConfigurationPath) {
        return this.configLoader.go(appConfigurationPath, hiddenConfigurationPath, new configuration_preprocessor_1.ConfigurationPreprocessor(this.defaultTypes, this.defaultFields, this.defaultRelations), new idai_field_configuration_validator_1.IdaiFieldConfigurationValidator());
    };
    return IdaiFieldAppConfigurator;
}());
IdaiFieldAppConfigurator = __decorate([
    core_1.Injectable()
    /**
     * @author Daniel de Oliveira
     */
    ,
    __metadata("design:paramtypes", [config_loader_1.ConfigLoader])
], IdaiFieldAppConfigurator);
exports.IdaiFieldAppConfigurator = IdaiFieldAppConfigurator;
//# sourceMappingURL=idai-field-app-configurator.js.map