System.register(['@angular/core/testing', "../app/core-services/project-configuration", "../app/md"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, project_configuration_1, md_1;
    /**
     * @author Daniel de Oliveira
     */
    function main() {
        testing_1.describe('ProjectConfiguration', function () {
            var firstLevelType = {
                "type": "FirstLevelType",
                "fields": [
                    {
                        "field": "fieldA"
                    }
                ]
            };
            var secondLevelType = {
                "type": "SecondLevelType",
                "parent": "FirstLevelType",
                "fields": [
                    {
                        "field": "fieldB"
                    }
                ]
            };
            testing_1.it('should let types inherit fields from parent types', function () {
                var dmc = new project_configuration_1.ProjectConfiguration({ "types": [firstLevelType, secondLevelType] });
                var fields = dmc.getFields('SecondLevelType');
                testing_1.expect(fields[0].field).toBe('fieldA');
                testing_1.expect(fields[1].field).toBe('fieldB');
            });
            testing_1.it('list parent type fields first', function () {
                var dmc = new project_configuration_1.ProjectConfiguration({ "types": [secondLevelType, firstLevelType] });
                var fields = dmc.getFields('SecondLevelType');
                testing_1.expect(fields[0].field).toBe('fieldA');
                testing_1.expect(fields[1].field).toBe('fieldB');
            });
            testing_1.it('should fail if parent type is not defined', function () {
                testing_1.expect(function () { new project_configuration_1.ProjectConfiguration({ "types": [secondLevelType] }); }).toThrow(md_1.MD.PC_GENERIC_ERROR);
            });
        });
    }
    exports_1("main", main);
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (project_configuration_1_1) {
                project_configuration_1 = project_configuration_1_1;
            },
            function (md_1_1) {
                md_1 = md_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=project-configuration.spec.js.map