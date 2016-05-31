System.register(['./lib/core-services/config-loader', './lib/core-services/persistence-manager', './lib/datastore/datastore', './lib/datastore/read-datastore', './lib/core-services/project-configuration', './lib/object-edit/object-edit.component', './lib/object-edit/relations-provider', './lib/core-services/messages.component', './lib/core-services/messages', './lib/md'], function(exports_1, context_1) {
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