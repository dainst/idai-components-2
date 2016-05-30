/// <reference path="../typings/browser/ambient/es6-shim/index.d.ts" />
/// <reference path="../typings/browser/ambient/node/index.d.ts" />
/// <reference path="../typings/browser/ambient/github-electron/index.d.ts" />

import {bootstrap}    from '@angular/platform-browser-dynamic'
import {AppComponent} from './app.component'
import {HTTP_PROVIDERS} from '@angular/http';
import {provide, enableProdMode} from '@angular/core';
import {Datastore} from "./core-services/datastore";
import {Messages} from "./core-services/messages";
import {MemoryDatastore} from "./datastore/indexeddb-datastore";
import {ConfigLoader} from "./core-services/config-loader";
import {RelationsProvider} from "./object-edit/relations-provider";
import {PersistenceManager} from "./core-services/persistence-manager";
import {M} from "./m";
import {ReadDatastore} from "./core-services/read-datastore";
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    provide(LocationStrategy, { useClass: HashLocationStrategy }),
    provide(Datastore, { useClass: MemoryDatastore }),
    provide(Messages, { useClass: Messages }),
    provide(ConfigLoader, {useClass: ConfigLoader}),
    provide(RelationsProvider, {useClass: RelationsProvider}),
    provide(PersistenceManager, {useClass: PersistenceManager}),
    provide(ConfigLoader, {useClass: ConfigLoader}),
    provide(M, {useClass: M})
]);
