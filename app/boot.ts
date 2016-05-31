/// <reference path="../typings/browser/ambient/es6-shim/index.d.ts" />
/// <reference path="../typings/browser/ambient/node/index.d.ts" />

import {bootstrap}    from '@angular/platform-browser-dynamic'
import {ObjectEditDemoComponent} from './object-edit-demo.component'
import {HTTP_PROVIDERS} from '@angular/http';
import {provide, enableProdMode} from '@angular/core';
import {Datastore} from "../lib/datastore/datastore";
import {Messages} from "../lib/core-services/messages";
import {MemoryDatastore} from "./memory-datastore";
import {ConfigLoader} from "../lib/core-services/config-loader";
import {RelationsProvider} from "../lib/object-edit/relations-provider";
import {PersistenceManager} from "../lib/core-services/persistence-manager";
import {MD} from "../lib/md";
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

bootstrap(ObjectEditDemoComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    provide(LocationStrategy, { useClass: HashLocationStrategy }),
    provide(Datastore, { useClass: MemoryDatastore }),
    provide(Messages, { useClass: Messages }),
    provide(ConfigLoader, {useClass: ConfigLoader}),
    provide(RelationsProvider, {useClass: RelationsProvider}),
    provide(PersistenceManager, {useClass: PersistenceManager}),
    provide(ConfigLoader, {useClass: ConfigLoader}),
    provide(MD, {useClass: MD})
]);
