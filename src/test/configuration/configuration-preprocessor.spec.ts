/// <reference path="../../../typings/globals/jasmine/index.d.ts" />
import {ConfigurationPreprocessor} from "../../app/configuration/configuration-preprocessor";

/**
 * @author Daniel de Oliveira
 */
export function main() {
    fdescribe('ConfigurationPreprocessor', () => {

        it('should add extra fields', function(){
            var t = { "type": "T",
                "fields": [
                    {
                        "name": "aField",
                        "label" : "A Field"
                    }]
            };
            var configuration = {
                "types" : [
                    t      
                ]
            };
            
            new ConfigurationPreprocessor()
                .go(
                    configuration,
                    [{name:'identifier'}]
                );

            expect(configuration['types'][0].fields[1].name).toBe('identifier');
        });
    });
}