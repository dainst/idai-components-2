/// <reference path="../../../typings/globals/jasmine/index.d.ts" />
import {ConfigurationDefinition} from "../../app/configuration/configuration-definition";
import {ConfigurationValidator} from "../../app/configuration/configuration-validator";
import {MDInternal} from "../../app/messages/md-internal";

/**
 * @author Daniel de Oliveira
 */
export function main() {
    fdescribe('ConfigurationValidator', () => {

        var configuration : ConfigurationDefinition;

        it('should report missing mandatory type', function(){

            configuration = {
                "types" : [
                    { "type": "T",
                        "fields": []
                    }
                ]
            };

            expect(ConfigurationValidator
                .go(
                    configuration,
                    ['Tmissing']
                )).toEqual([MDInternal.VALIDATION_ERROR_MISSINGTYPE,'Tmissing']);
        });

        it('should report duplicate type', function(){

            configuration = {
                "types" : [
                    { "type": "Tduplicate",
                        "fields": []
                    },
                    { "type": "Tduplicate",
                        "fields": []
                    }
                ]
            };

            expect(ConfigurationValidator
                .go(
                    configuration, []
                )).toEqual([MDInternal.VALIDATION_ERROR_DUPLICATETYPE,'Tduplicate']);
        });
    });
}