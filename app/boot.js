/// <reference path="../typings/browser/ambient/es6-shim/index.d.ts" />
/// <reference path="../typings/browser/ambient/node/index.d.ts" />
/// <reference path="../typings/browser/ambient/github-electron/index.d.ts" />
System.register(['@angular/platform-browser-dynamic', './app.component', '@angular/http', '@angular/core', "./core-services/datastore", "./core-services/messages", "./datastore/indexeddb-datastore", "./core-services/config-loader", "./object-edit/relations-provider", "./core-services/persistence-manager", "./m", '@angular/router-deprecated', '@angular/common'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var platform_browser_dynamic_1, app_component_1, http_1, core_1, datastore_1, messages_1, indexeddb_datastore_1, config_loader_1, relations_provider_1, persistence_manager_1, m_1, router_deprecated_1, common_1;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (datastore_1_1) {
                datastore_1 = datastore_1_1;
            },
            function (messages_1_1) {
                messages_1 = messages_1_1;
            },
            function (indexeddb_datastore_1_1) {
                indexeddb_datastore_1 = indexeddb_datastore_1_1;
            },
            function (config_loader_1_1) {
                config_loader_1 = config_loader_1_1;
            },
            function (relations_provider_1_1) {
                relations_provider_1 = relations_provider_1_1;
            },
            function (persistence_manager_1_1) {
                persistence_manager_1 = persistence_manager_1_1;
            },
            function (m_1_1) {
                m_1 = m_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
                router_deprecated_1.ROUTER_PROVIDERS,
                http_1.HTTP_PROVIDERS,
                core_1.provide(common_1.LocationStrategy, { useClass: common_1.HashLocationStrategy }),
                core_1.provide(datastore_1.Datastore, { useClass: indexeddb_datastore_1.MemoryDatastore }),
                core_1.provide(messages_1.Messages, { useClass: messages_1.Messages }),
                core_1.provide(config_loader_1.ConfigLoader, { useClass: config_loader_1.ConfigLoader }),
                core_1.provide(relations_provider_1.RelationsProvider, { useClass: relations_provider_1.RelationsProvider }),
                core_1.provide(persistence_manager_1.PersistenceManager, { useClass: persistence_manager_1.PersistenceManager }),
                core_1.provide(config_loader_1.ConfigLoader, { useClass: config_loader_1.ConfigLoader }),
                core_1.provide(m_1.M, { useClass: m_1.M })
            ]);
        }
    }
});
//# sourceMappingURL=boot.js.map