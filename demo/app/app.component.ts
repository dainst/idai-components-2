import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Routes} from '@angular/router';
import {DocumentEditDemoComponent} from './document-edit-demo.component';
import {MessagesDemoComponent} from './messages-demo.component';
import {Messages} from '../../src/app/core-services/messages';
import {ConfigLoader} from '../../src/app/object-edit/config-loader';

/**
 * @author Daniel de Oliveira
 */
@Component({
    selector: 'idai-components-demo-app',
    templateUrl: 'demo/templates/app.html',
    directives: [ROUTER_DIRECTIVES]
})
@Routes([
    {path: '/edit', component: DocumentEditDemoComponent},
    {path: '/messages', component: MessagesDemoComponent}
])
export class AppComponent {
    constructor(
        private configLoader: ConfigLoader,
        private messages: Messages
    ) {
        configLoader.configuration().subscribe(
            result=>{
                if (result.error)
                    messages.add(result.error.msgkey,[result.error.msgparams]);
            }
        )
    }
}