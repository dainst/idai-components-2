import {ProjectConfiguration} from "../../../src/app/configuration/project-configuration";
import {MDInternal} from "../../../src/app/messages/md-internal";

/**
 * @author Daniel de Oliveira
 */
export function main() {
    describe('ProjectConfiguration', () => {

        var firstLevelType = {
            "type": "FirstLevelType",
            "fields": [
                {
                    "name": "fieldA",
                    "label" : "Field A"
                }
            ]
        };

        var secondLevelType = {
            "type": "SecondLevelType",
            "parent" : "FirstLevelType",
            "fields": [
                {
                    "name": "fieldB"
                }
            ]
        };

        var thirdLevelType = {
            "type": "ThirdLevelType",
            "parent" : "SecondLevelType",
            "fields": [
                {
                    "name": "fieldC"
                }
            ]
        };
        
        it('should get label for type', function(){
            var t = { "type": "T",
                "fields": [
                    {
                        "name": "aField",
                        "label" : "A Field"
                    }]
            };
            var pc = new ProjectConfiguration({"types":[ t ]});
            expect(pc.getFieldDefinitionLabel('T',"aField")).toBe('A Field');
        });

        it('should get default label when not defined', function(){
            var t = { "type": "T",
                "fields": [
                {
                    "name": "aField",
                }]
            };
            var pc = new ProjectConfiguration({"types":[ t ]});
            expect(pc.getFieldDefinitionLabel('T',"aField")).toBe('aField');
        });

        it('should throw an error when field not defined', function(){
            var pc = new ProjectConfiguration({"types":[ ]});
            expect(function () { pc.getFieldDefinitionLabel('UndefinedType',"someField")})
                .toThrow();
        });

        it('should let types inherit fields from parent types',
            function() {

                var pc = new ProjectConfiguration({"types":[ firstLevelType, secondLevelType ]});

                var fields=pc.getFieldDefinitions('SecondLevelType');
                expect(fields[0].name).toBe('fieldA');
                expect(fields[1].name).toBe('fieldB');
            }
        );


        it('list parent type fields first',
            function() {

                var pc = new ProjectConfiguration({"types":[ secondLevelType, firstLevelType ]});

                var fields=pc.getFieldDefinitions('SecondLevelType');
                expect(fields[0].name).toBe('fieldA');
                expect(fields[1].name).toBe('fieldB');
            }
        );

        it('should fail if parent type is not defined',
            function() {
                expect(function(){new ProjectConfiguration({"types":[ secondLevelType ]})}).toThrow(MDInternal.PC_GENERIC_ERROR)
            }
        );

        it('should return parent types',
            function() {
                let pc = new ProjectConfiguration({"types":[ firstLevelType, secondLevelType, thirdLevelType ]});
                let parents = pc.getParentTypes('ThirdLevelType');
                expect(parents).toEqual(['SecondLevelType', 'FirstLevelType']);
                parents = pc.getParentTypes('SecondLevelType');
                expect(parents).toEqual(['FirstLevelType']);
                parents = pc.getParentTypes('FirstLevelType');
                expect(parents).toEqual([]);
            }
        );
    });
}