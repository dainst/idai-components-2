import {Component} from '@angular/core';
import {Messages} from '../../src/app/messages/messages';
import {ConfigLoader} from '../../src/app/configuration/config-loader';

@Component({
    selector: 'idai-components-demo-app',
    templateUrl: 'demo/templates/app.html'
})
/**
 * @author Daniel de Oliveira
 */
export class AppComponent {
    constructor(
        private configLoader: ConfigLoader,
        private messages: Messages
    ) {
        configLoader.getProjectConfiguration().catch(
            msgWithParams => {
                messages.addWithParams(msgWithParams);
            }
        )
    }
}