/// <reference path="../../typings/globals/jasmine/index.d.ts" />
import {ProjectConfiguration} from "../app/object-edit/project-configuration";
import {MDInternal} from "../app/core-services/md-internal";

/**
 * @author Daniel de Oliveira
 */
export function main() {
    describe('ProjectConfiguration', () => {

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
            "parent" : "FirstLevelType",
            "fields": [
                {
                    "field": "fieldB"
                }
            ]
        };

        it('should let types inherit fields from parent types',
            function() {

                var dmc = new ProjectConfiguration({"types":[ firstLevelType, secondLevelType ]});

                var fields=dmc.getFields('SecondLevelType');
                expect(fields[0].field).toBe('fieldA');
                expect(fields[1].field).toBe('fieldB');
            }
        );


        it('list parent type fields first',
            function() {

                var dmc = new ProjectConfiguration({"types":[ secondLevelType, firstLevelType ]});

                var fields=dmc.getFields('SecondLevelType');
                expect(fields[0].field).toBe('fieldA');
                expect(fields[1].field).toBe('fieldB');
            }
        );

        it('should fail if parent type is not defined',
            function() {
                expect(function(){new ProjectConfiguration({"types":[ secondLevelType ]})}).toThrow(MDInternal.PC_GENERIC_ERROR)
            }
        );
    });
}