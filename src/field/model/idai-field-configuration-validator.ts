import {ConfigurationValidator} from '../../core/configuration/configuration-validator';
import {ConfigurationDefinition} from '../../core/configuration/configuration-definition';


/**
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
export class IdaiFieldConfigurationValidator extends ConfigurationValidator{


    protected custom(configuration: ConfigurationDefinition) {

        return [];
    }
}