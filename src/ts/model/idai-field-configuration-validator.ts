import {ConfigurationValidator} from '..//configuration/configuration-validator';
import {ConfigurationDefinition} from '..//configuration/configuration-definition';


/**
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
export class IdaiFieldConfigurationValidator extends ConfigurationValidator{


    protected custom(configuration: ConfigurationDefinition) {

        return [];
    }
}