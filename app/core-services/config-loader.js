System.register(["@angular/core", "./project-configuration", "./messages", "@angular/http", "../md"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, project_configuration_1, messages_1, http_1, md_1;
    var ConfigLoader;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (project_configuration_1_1) {
                project_configuration_1 = project_configuration_1_1;
            },
            function (messages_1_1) {
                messages_1 = messages_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (md_1_1) {
                md_1 = md_1_1;
            }],
        execute: function() {
            /**
             * @author Daniel de Oliveira
             */
            ConfigLoader = (function () {
                function ConfigLoader(http, messages) {
                    this.http = http;
                    this.messages = messages;
                }
                ConfigLoader.prototype.getProjectConfiguration = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.http.get(ConfigLoader.PROJECT_CONFIGURATION_PATH).
                            subscribe(function (data_) {
                            var data;
                            try {
                                data = JSON.parse(data_['_body']);
                            }
                            catch (e) {
                                _this.messages.add(md_1.MD.PARSE_GENERIC_ERROR);
                                reject(e.message);
                            }
                            try {
                                resolve(new project_configuration_1.ProjectConfiguration(data));
                            }
                            catch (e) {
                                _this.messages.add(e);
                                reject(e);
                            }
                        });
                    });
                };
                ConfigLoader.PROJECT_CONFIGURATION_PATH = 'config/Configuration.json';
                ConfigLoader = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, messages_1.Messages])
                ], ConfigLoader);
                return ConfigLoader;
            }());
            exports_1("ConfigLoader", ConfigLoader);
        }
    }
});
//# sourceMappingURL=config-loader.js.map