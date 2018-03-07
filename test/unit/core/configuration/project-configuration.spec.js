"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var project_configuration_1 = require("../../../../src/core/configuration/project-configuration");
var md_internal_1 = require("../../../../src/core/messages/md-internal");
/**
 * @author Daniel de Oliveira
 */
describe('ProjectConfiguration', function () {
    var firstLevelType = {
        "type": "FirstLevelType",
        "fields": [
            {
                "name": "fieldA",
                "label": "Field A"
            }
        ]
    };
    var secondLevelType = {
        "type": "SecondLevelType",
        "parent": "FirstLevelType",
        "fields": [
            {
                "name": "fieldB"
            }
        ]
    };
    var thirdLevelType = {
        "type": "ThirdLevelType",
        "parent": "SecondLevelType",
        "fields": [
            {
                "name": "fieldC"
            }
        ]
    };
    it('should get label for type', function () {
        var t = { "type": "T",
            "fields": [
                {
                    "name": "aField",
                    "label": "A Field"
                }
            ]
        };
        var pc = new project_configuration_1.ProjectConfiguration({ "types": [t] });
        expect(pc.getFieldDefinitionLabel('T', "aField")).toBe('A Field');
    });
    it('should get default label when not defined', function () {
        var t = { "type": "T",
            "fields": [
                {
                    "name": "aField",
                }
            ]
        };
        var pc = new project_configuration_1.ProjectConfiguration({ "types": [t] });
        expect(pc.getFieldDefinitionLabel('T', "aField")).toBe('aField');
    });
    it('should throw an error when field not defined', function () {
        var pc = new project_configuration_1.ProjectConfiguration({ "types": [] });
        expect(function () { pc.getFieldDefinitionLabel('UndefinedType', "someField"); })
            .toThrow();
    });
    it('should let types inherit fields from parent types', function () {
        var pc = new project_configuration_1.ProjectConfiguration({ "types": [firstLevelType, secondLevelType] });
        var fields = pc.getFieldDefinitions('SecondLevelType');
        expect(fields[0].name).toBe('fieldA');
        expect(fields[1].name).toBe('fieldB');
    });
    it('list parent type fields first', function () {
        var pc = new project_configuration_1.ProjectConfiguration({ "types": [secondLevelType, firstLevelType] });
        var fields = pc.getFieldDefinitions('SecondLevelType');
        expect(fields[0].name).toBe('fieldA');
        expect(fields[1].name).toBe('fieldB');
    });
    it('should fail if parent type is not defined', function () {
        expect(function () { new project_configuration_1.ProjectConfiguration({ "types": [secondLevelType] }); }).toThrow(md_internal_1.MDInternal.PC_GENERIC_ERROR);
    });
});
//# sourceMappingURL=project-configuration.spec.js.map