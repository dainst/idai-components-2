import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders}  from '@angular/core';
import {MessagesDemoComponent} from './messages-demo.component';

const routes: Routes = [
    { path: '', redirectTo: 'edit', pathMatch: 'full' },
    { path: 'messages', component: MessagesDemoComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);