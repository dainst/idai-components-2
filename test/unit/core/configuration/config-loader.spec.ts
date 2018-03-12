import {ConfigurationDefinition} from '../../../../src/core/configuration/configuration-definition';
import {ConfigLoader} from '../../../../src/core/configuration/config-loader';
import {ConfigurationPreprocessor} from '../../../../src/core/configuration/configuration-preprocessor';

/**
 * @author Daniel de Oliveira
 */
describe('ConfigLoader',() => {

    let configuration: ConfigurationDefinition;
    let configLoader: ConfigLoader;


    beforeEach(() => {
       
        configuration = {
            identifier: 'Conf',
            types: [
                {type: 'A'}, 
                {type: 'B'},
                {type: 'C'},
                {type: 'D'},
                {type: 'A1', parent: 'A'},
                {type: 'A2', parent: 'A'},
                {type: 'B1', parent: 'B'},
                {type: 'B2', parent: 'B'},
            ],
            relations: []
        };

        const configReader = jasmine.createSpyObj(
            'confRead',['read']);
        configReader.read.and.returnValue(Promise.resolve(configuration));
        configLoader = new ConfigLoader(configReader);
    });


    it('mix extisting externally configured with internal inherits rel', async (done) => {

        configuration.relations.push({
            name: 'connection',
            domain: ['C'],
            range: ['D']
        });

        const pconf = await configLoader.go(
            'yo',
            undefined,
            new ConfigurationPreprocessor(
                [],
                [],
                [{
                    name: 'connection',
                    domain: ['A:inherit'], // TODO reject config if not an array
                    range: ['B:inherit']
                }]
            ),
            undefined,
        );
        
        expect(pconf.getRelationDefinitions('A')[0].range).toContain('B1');
        expect(pconf.getRelationDefinitions('A1')[0].range).toContain('B');
        expect(pconf.getRelationDefinitions('A2')[0].range).toContain('B2');
        expect(pconf.getRelationDefinitions('C')[0].range).toContain('D');
        done();
    });
});