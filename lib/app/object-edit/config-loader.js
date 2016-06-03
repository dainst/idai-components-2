System.register(["@angular/core", "./project-configuration", "./relations-configuration", "@angular/http", "../core-services/md", "rxjs/Observable"], function(exports_1, context_1) {
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
    var core_1, project_configuration_1, relations_configuration_1, http_1, md_1, Observable_1;
    var ConfigLoader;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (project_configuration_1_1) {
                project_configuration_1 = project_configuration_1_1;
            },
            function (relations_configuration_1_1) {
                relations_configuration_1 = relations_configuration_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (md_1_1) {
                md_1 = md_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            }],
        execute: function() {
            /**
             * @author Daniel de Oliveira
             */
            ConfigLoader = (function () {
                function ConfigLoader(http) {
                    this.http = http;
                    this.projectConfigurationObservers = [];
                    this.relationsConfigurationObservers = [];
                }
                /**
                 * @returns {Promise<ProjectConfiguration>} which gets rejected with a key of MD or an error msg in case of an error.
                 */
                ConfigLoader.prototype.projectConfiguration = function () {
                    var _this = this;
                    return Observable_1.Observable.create(function (observer) {
                        _this.projectConfigurationObservers.push(observer);
                    });
                };
                ConfigLoader.prototype.relationsConfiguration = function () {
                    var _this = this;
                    return Observable_1.Observable.create(function (observer) {
                        _this.relationsConfigurationObservers.push(observer);
                    });
                };
                ConfigLoader.prototype.setProjectConfiguration = function (path) {
                    this.read(path, this, function (data, self) {
                        self.relationsConfigurationObservers.forEach(function (observer) {
                            return observer.next(new project_configuration_1.ProjectConfiguration(data));
                        });
                    });
                };
                ConfigLoader.prototype.setRelationsConfiguration = function (path) {
                    this.read(path, this, function (data, self) {
                        self.relationsConfigurationObservers.forEach(function (observer) {
                            return observer.next(new relations_configuration_1.RelationsConfiguration(data['relations']));
                        });
                    });
                };
                ConfigLoader.prototype.read = function (path, self, createMethod) {
                    this.http.get(path).
                        subscribe(function (data_) {
                        var data;
                        try {
                            data = JSON.parse(data_['_body']);
                        }
                        catch (e) {
                            console.error(md_1.MD.PARSE_GENERIC_ERROR);
                        }
                        try {
                            createMethod(data, self);
                        }
                        catch (e) {
                            console.error(e);
                        }
                    });
                };
                ConfigLoader = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ConfigLoader);
                return ConfigLoader;
            }());
            exports_1("ConfigLoader", ConfigLoader);
        }
    }
});
//# sourceMappingURL=config-loader.js.map