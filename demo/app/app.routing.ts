import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders}  from '@angular/core';
import {MessagesDemoComponent} from './messages-demo.component';
import {MapDemoComponent} from './map-demo.component';

const routes: Routes = [
    {path: '', redirectTo: 'edit', pathMatch: 'full'},
    {path: 'messages', component: MessagesDemoComponent},
    {path: 'map', component: MapDemoComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);