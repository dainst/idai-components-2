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
var config_loader_1 = require("../configuration/config-loader");
var idai_field_configuration_validator_1 = require("./idai-field-configuration-validator");
var idai_field_pre_preprocess_configuration_validator_1 = require("../configuration/idai-field-pre-preprocess-configuration-validator");
var IdaiFieldAppConfigurator = /** @class */ (function () {
    function IdaiFieldAppConfigurator(configLoader) {
        this.configLoader = configLoader;
        this.defaultTypes = {
            Place: {
                fields: {
                    hasGazId: {
                        inputType: 'unsignedInt'
                    }
                }
            },
            Operation: {
                fields: {},
                abstract: true
            },
            Feature: {
                fields: {
                    hasPeriod: {
                        inputType: "dropdownRange"
                    }
                }
            },
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
            },
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
            }
        };
        this.defaultFields = {
            shortDescription: {
                label: 'Kurzbeschreibung',
                visible: false
            },
            identifier: {
                description: 'Eindeutiger Bezeichner dieser Ressource',
                label: 'Bezeichner',
                visible: false,
                mandatory: true
            },
            geometry: {
                visible: false,
                editable: false
            }
        };
        this.defaultFieldsOrder = [
            'identifier',
            'shortDescription'
        ];
        this.defaultRelations = [
            { name: 'depicts', domain: ['Image:inherit'],
                inverse: 'isDepictedIn', label: 'Zeigt', editable: true },
            { name: 'isDepictedIn', range: ['Image:inherit'],
                inverse: 'depicts', visible: false, editable: false },
            { name: 'isLocatedIn', domain: ['Operation:inherit'], label: 'Liegt im Ort',
                inverse: 'locates', range: ['Place'] },
            { name: 'locates', domain: ['Place'], label: 'Enthält Maßnahme', inverse: 'isLocatedIn',
                range: ['Operation:inherit'] },
            { name: 'isAfter', inverse: 'isBefore', label: 'Zeitlich nach',
                domain: ['Feature:inherit'], range: ['Feature:inherit'], sameMainTypeResource: true },
            { name: 'isBefore', inverse: 'isAfter', label: 'Zeitlich vor',
                domain: ['Feature:inherit'], range: ['Feature:inherit'], sameMainTypeResource: true },
            { name: 'isContemporaryWith', inverse: 'isContemporaryWith', label: 'Zeitgleich mit',
                domain: ['Feature:inherit'], range: ['Feature:inherit'], sameMainTypeResource: true },
        ];
    }
    IdaiFieldAppConfigurator.prototype.go = function (configDirPath, applyMeninxConfiguration) {
        if (applyMeninxConfiguration === void 0) { applyMeninxConfiguration = false; }
        return this.configLoader.go(configDirPath, this.defaultTypes, this.defaultRelations, this.defaultFields, this.defaultFieldsOrder, new idai_field_pre_preprocess_configuration_validator_1.IdaiFieldPrePreprocessConfigurationValidator(), new idai_field_configuration_validator_1.IdaiFieldConfigurationValidator(), applyMeninxConfiguration);
    };
    IdaiFieldAppConfigurator = __decorate([
        core_1.Injectable()
        /**
         * @author Daniel de Oliveira
         * @author Thomas Kleinke
         */
        ,
        __metadata("design:paramtypes", [config_loader_1.ConfigLoader])
    ], IdaiFieldAppConfigurator);
    return IdaiFieldAppConfigurator;
}());
exports.IdaiFieldAppConfigurator = IdaiFieldAppConfigurator;
//# sourceMappingURL=idai-field-app-configurator.js.map