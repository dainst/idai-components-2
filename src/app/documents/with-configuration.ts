import {ProjectConfiguration} from "../configuration/project-configuration";
import {ConfigLoader} from "../configuration/config-loader";

/**
 * @author Daniel de Oliveira
 */
export class WithConfiguration  {

    protected projectConfiguration: ProjectConfiguration;

    constructor(configLoader:ConfigLoader) {
        configLoader.configuration().subscribe((result) => {
            if(result.error == undefined) {
                this.projectConfiguration = result.projectConfiguration;
            }
        });
    }
}