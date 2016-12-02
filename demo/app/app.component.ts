import {Component} from '@angular/core';
import {Messages} from '../../src/app/messages/messages';
import {ConfigLoader} from '../../src/app/configuration/config-loader';

/**
 * @author Daniel de Oliveira
 */
@Component({
    selector: 'idai-components-demo-app',
    templateUrl: 'demo/templates/app.html'
})
export class AppComponent {
    constructor(
        private configLoader: ConfigLoader,
        private messages: Messages
    ) {
        configLoader.configuration().subscribe(
            result=>{
                if (result.error) messages.addWithParams(result.error);
            }
        )
    }
}