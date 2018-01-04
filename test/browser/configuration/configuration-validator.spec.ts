import {ConfigurationDefinition} from '../../../src/app/configuration/configuration-definition';
import {ConfigurationValidator} from '../../../src/app/configuration/configuration-validator';
import {ConfigurationErrors} from '../../../src/app/configuration/configuration-errors';


/**
 * @author Daniel de Oliveira
 */
export function main() {

    describe('ConfigurationValidator', () => {

        let configuration: ConfigurationDefinition;

        it('should report missing mandatory type', function() {

            configuration = {
                identifier: 'test',
                types : [{ type: 'T', fields: []}]
            };

            expect(new ConfigurationValidator(['Tmissing'])
                .go(configuration))
                .toContain([ConfigurationErrors.INVALID_CONFIG_MISSINGTYPE,'Tmissing']);
        });


        it('should report duplicate type', function() {

            configuration = {
                identifier: 'test',
                types : [
                    { type: 'Tduplicate', fields: []},
                    { type: 'Tduplicate', fields: []}
                ]
            };

            expect(new ConfigurationValidator([])
                .go(configuration))
                .toContain([ConfigurationErrors.INVALID_CONFIG_DUPLICATETYPE,'Tduplicate']);
        });


        it('should report missing parent type', function() {

            configuration = {
                identifier: 'test',
                types : [{ type: 'T', fields: [], parent: 'P'}]
            };

            expect(new ConfigurationValidator(['T'])
                .go(configuration))
                .toContain([ConfigurationErrors.INVALID_CONFIG_MISSINGPARENTTYPE,'P']);
        });


        it('should report unnamed type', function() {

            configuration = {
                identifier: 'test',
                types : [{ fields: []} as any]
            };

            expect(new ConfigurationValidator(['T'])
                .go(configuration))
                .toContain([ConfigurationErrors.INVALID_CONFIG_INVALIDTYPE,
                    JSON.stringify({ fields: []})]);
        });
    });
}