import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders}  from '@angular/core';
import {DocumentEditDemoComponent} from './document-edit-demo.component';
import {MessagesDemoComponent} from './messages-demo.component';
import {DocumentViewDemoComponent} from "./document-view-demo.component";
import {StylingsDemoComponent} from "./stylings-demo.component";

const routes: Routes = [
    {path: '', redirectTo: 'edit', pathMatch: 'full'},
    {path: 'edit', component: DocumentEditDemoComponent},
    {path: 'view', component: DocumentViewDemoComponent},
    {path: 'messages', component: MessagesDemoComponent},
    {path: 'stylings', component: StylingsDemoComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);