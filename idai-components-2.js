System.register(['./app/core-services/config-loader', './app/core-services/persistence-manager', './app/datastore/datastore', './app/datastore/read-datastore', './app/core-services/project-configuration', './app/object-edit/object-edit.component', './app/object-edit/relations-provider', './app/core-services/messages.component', './app/core-services/messages', './app/md'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters:[
            function (config_loader_1_1) {
                exports_1({
                    "ConfigLoader": config_loader_1_1["ConfigLoader"]
                });
            },
            function (persistence_manager_1_1) {
                exports_1({
                    "PersistenceManager": persistence_manager_1_1["PersistenceManager"]
                });
            },
            function (datastore_1_1) {
                exports_1({
                    "Datastore": datastore_1_1["Datastore"]
                });
            },
            function (read_datastore_1_1) {
                exports_1({
                    "ReadDatastore": read_datastore_1_1["ReadDatastore"]
                });
            },
            function (project_configuration_1_1) {
                exports_1({
                    "ProjectConfiguration": project_configuration_1_1["ProjectConfiguration"]
                });
            },
            function (object_edit_component_1_1) {
                exports_1({
                    "ObjectEditComponent": object_edit_component_1_1["ObjectEditComponent"]
                });
            },
            function (relations_provider_1_1) {
                exports_1({
                    "RelationsProvider": relations_provider_1_1["RelationsProvider"]
                });
            },
            function (messages_component_1_1) {
                exports_1({
                    "MessagesComponent": messages_component_1_1["MessagesComponent"]
                });
            },
            function (messages_1_1) {
                exports_1({
                    "Messages": messages_1_1["Messages"]
                });
            },
            function (md_1_1) {
                exports_1({
                    "MD": md_1_1["MD"]
                });
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=idai-components-2.js.map