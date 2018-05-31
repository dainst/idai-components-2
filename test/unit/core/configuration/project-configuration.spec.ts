import {ProjectConfiguration} from '../../../../src/core/configuration/project-configuration';
import {MDInternal} from '../../../../src/core/messages/md-internal';

/**
 * @author Daniel de Oliveira
 */
describe('ProjectConfiguration', () => {

    const firstLevelType = {
        type: 'FirstLevelType',
        fields: [
            {
                name: 'fieldA',
                label: 'Field A'
            }
        ]
    };

    const secondLevelType = {
        type: 'SecondLevelType',
        parent: 'FirstLevelType',
        fields: [
            {
                name: 'fieldB'
            }
        ]
    };


    it('should get label for type', () => {

        const type = {
            type: 'T',
            fields: [
                {
                    name: 'aField',
                    label: 'A Field'
                }
            ]
        };

        const configuration: ProjectConfiguration = new ProjectConfiguration({ types: [type] });

        expect(configuration.getFieldDefinitionLabel('T','aField')).toBe('A Field');
    });


    it('should get default label if not defined', () => {

        const type = {
            type: 'T',
            fields: [
                {
                    name: 'aField'
                }
            ]
        };

        const configuration: ProjectConfiguration = new ProjectConfiguration({ types: [type] });

        expect(configuration.getFieldDefinitionLabel('T','aField')).toBe('aField');
    });


    it('should throw an error if field is not defined', () => {

        const configuration: ProjectConfiguration = new ProjectConfiguration({ types: [] });

        expect(() => {
            configuration.getFieldDefinitionLabel('UndefinedType','someField');
        }).toThrow();
    });


    it('should let types inherit fields from parent types', () => {

        const configuration: ProjectConfiguration
            = new ProjectConfiguration({ types: [firstLevelType, secondLevelType] });
        const fields = configuration.getFieldDefinitions('SecondLevelType');

        expect(fields[0].name).toEqual('fieldA');
        expect(fields[1].name).toEqual('fieldB');
    });


    it('list parent type fields first', () => {

        const configuration: ProjectConfiguration
            = new ProjectConfiguration({ types: [secondLevelType, firstLevelType]});

        const fields = configuration.getFieldDefinitions('SecondLevelType');
        expect(fields[0].name).toEqual('fieldA');
        expect(fields[1].name).toEqual('fieldB');
    });


    it('should fail if parent type is not defined', () => {

        expect(() => {
            new ProjectConfiguration({ types: [secondLevelType] });
        }).toThrow(MDInternal.PC_GENERIC_ERROR);
    });
});
