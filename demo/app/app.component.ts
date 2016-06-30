import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Routes} from '@angular/router';
import {DocumentEditDemoComponent} from './document-edit-demo.component';
import {MessagesDemoComponent} from './messages-demo.component';

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
}