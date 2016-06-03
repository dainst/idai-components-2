import {Component, OnInit, Inject} from '@angular/core';
import { Router,ROUTER_DIRECTIVES, Routes } from '@angular/router';
import {ObjectEditDemoComponent} from './object-edit-demo.component';

/**
 * @author Daniel de Oliveira
 */
@Component({
    selector: 'idai-components-demo-app',
    templateUrl: 'demo/templates/app.html',
    directives: [ROUTER_DIRECTIVES]
})
@Routes([
    {path: '/edit', component: ObjectEditDemoComponent},
])
export class AppComponent {
}