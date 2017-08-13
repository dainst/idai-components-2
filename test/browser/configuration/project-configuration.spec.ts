import {ProjectConfiguration} from "../../../src/app/configuration/project-configuration";
import {MDInternal} from "../../../src/app/messages/md-internal";

/**
 * @author Daniel de Oliveira
 */
export function main() {
    describe('ProjectConfiguration', () => {

        const firstLevelType = {
            "type": "FirstLevelType",
            "fields": [
                {
                    "name": "fieldA",
                    "label" : "Field A"
                }
            ]
        };

        const secondLevelType = {
            "type": "SecondLevelType",
            "parent" : "FirstLevelType",
            "fields": [
                {
                    "name": "fieldB"
                }
            ]
        };

        const thirdLevelType = {
            "type": "ThirdLevelType",
            "parent" : "SecondLevelType",
            "fields": [
                {
                    "name": "fieldC"
                }
            ]
        };
        
        it('should get label for type', () => {
            const t = { "type": "T",
                "fields": [
                    {
                        "name": "aField",
                        "label" : "A Field"
                    }]
            };
            const pc = new ProjectConfiguration({"types":[ t ]});
            expect(pc.getFieldDefinitionLabel('T',"aField")).toBe('A Field');
        });

        it('should get default label when not defined', () => {
            const t = { "type": "T",
                "fields": [
                {
                    "name": "aField",
                }]
            };
            const pc = new ProjectConfiguration({"types":[ t ]});
            expect(pc.getFieldDefinitionLabel('T',"aField")).toBe('aField');
        });

        it('should throw an error when field not defined', () => {
            const pc = new ProjectConfiguration({"types":[ ]});
            expect(function () { pc.getFieldDefinitionLabel('UndefinedType',"someField")})
                .toThrow();
        });

        it('should let types inherit fields from parent types',
            () => {

                const pc = new ProjectConfiguration({"types":[ firstLevelType, secondLevelType ]});

                const fields=pc.getFieldDefinitions('SecondLevelType');
                expect(fields[0].name).toBe('fieldA');
                expect(fields[1].name).toBe('fieldB');
            }
        );


        it('list parent type fields first',
            () => {

                const pc = new ProjectConfiguration({"types":[ secondLevelType, firstLevelType ]});

                const fields=pc.getFieldDefinitions('SecondLevelType');
                expect(fields[0].name).toBe('fieldA');
                expect(fields[1].name).toBe('fieldB');
            }
        );

        it('should fail if parent type is not defined',
            () => {
                expect(function(){new ProjectConfiguration({"types":[ secondLevelType ]})}).toThrow(MDInternal.PC_GENERIC_ERROR)
            }
        );
    });
}