import {IdaiFieldAppConfigurator} from '../../../src/app/idai-field-model/idai-field-app-configurator';
import {ConfigLoader} from '../../../src/app/configuration/config-loader';

/**
 * @author Daniel de Oliveira
 */
export function main() {

    describe('IdaiFieldAppConfigurator', () => {


        it('should run',
            (done) => {

                const http = jasmine.createSpyObj('http',
                    ['get']);
                let cbfun;
                http.get.and.returnValue({ subscribe: (cb) =>
                    {cb({"_body": JSON.stringify({
                            types: [
                                {type: "A"},
                                {type: "ConcreteOperation", parent: 'Operation'},
                                {type: "B"},
                            ],
                            relations:[
                                { name: 'isRecordedIn', domain: ['A'], label: "Gehört zu",
                                    range: ['Operation'], inverse: 'NO-INVERSE', visible: false, editable: false },
                                { name: 'isRecordedIn', domain: ['B'], label: "Gehört zu",
                                    range: ['ConcreteOperation'], inverse: 'NO-INVERSE', visible: false, editable: false },
                            ]
                        }
                    )})}}
                );

                const configLoader = new ConfigLoader(http);

                new IdaiFieldAppConfigurator(configLoader).go(
                    'democonf'
                );

                configLoader.getProjectConfiguration().then(
                    projectConfiguration => {
                        expect(
                            projectConfiguration.getRelationDefinitions(
                                "ConcreteOperation")
                                    .filter((dfn) => dfn.name == 'isRecordedIn')[0].range[0])
                            .toEqual('Project');
                        done();
                    }
                ).catch(e => fail(e));
            }
        );
    })
}