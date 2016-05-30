System.register(["@angular/core", "../m"], function(exports_1, context_1) {
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
    var core_1, m_1;
    var ProjectConfiguration;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (m_1_1) {
                m_1 = m_1_1;
            }],
        execute: function() {
            /**
             * ProjectConfiguration maintains the current projects properties.
             * Amongst them is the set of types for the current project,
             * which ProjectConfiguration provides to its clients.
             *
             * Within a project, objects of the available types can get created,
             * where every type is a configuration of different fields.
             *
             * @author Thomas Kleinke
             * @author Daniel de Oliveira
             */
            ProjectConfiguration = (function () {
                /**
                 * @param configuration
                 */
                function ProjectConfiguration(configuration) {
                    this.fieldMap = {};
                    this.initFieldMap(configuration['types']);
                    this.expandTypesWithParentFields(configuration['types']);
                    this.excavation = configuration['excavation'];
                }
                /**
                 * @returns {string[]} array with the names of all types of the current project.
                 */
                ProjectConfiguration.prototype.getTypes = function () {
                    return Object.keys(this.fieldMap);
                };
                /**
                 * @param typeName
                 * @returns {any[]} the fields definitions for the type.
                 */
                ProjectConfiguration.prototype.getFields = function (typeName) {
                    return this.fieldMap[typeName];
                };
                /**
                 * @returns {string} the name of the excavation, if defined.
                 *   <code>undefined</code> otherwise.
                 */
                ProjectConfiguration.prototype.getExcavationName = function () {
                    return this.excavation;
                };
                ProjectConfiguration.prototype.initFieldMap = function (types) {
                    for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                        var type = types_1[_i];
                        this.fieldMap[this.name(type)] = type.fields;
                    }
                };
                ProjectConfiguration.prototype.expandTypesWithParentFields = function (types) {
                    for (var _i = 0, types_2 = types; _i < types_2.length; _i++) {
                        var type = types_2[_i];
                        if (this.hasParent(type)) {
                            this.fieldMap[this.name(type)]
                                = this.prependFieldsOfParentType(type);
                        }
                    }
                };
                ProjectConfiguration.prototype.name = function (type) {
                    return type.type;
                };
                ProjectConfiguration.prototype.hasParent = function (type) {
                    return type['parent'];
                };
                /**
                 * @param type
                 * @returns {Array[]} a new fields array, with the fields
                 *   of the parent type from the field map first,
                 *   and then the types own fields.
                 */
                ProjectConfiguration.prototype.prependFieldsOfParentType = function (type) {
                    var fields = [];
                    if (this.fieldMap[type.parent] == undefined) {
                        throw m_1.M.PC_GENERIC_ERROR;
                    }
                    else
                        fields = this.fieldMap[type.parent];
                    return fields.concat(type.fields);
                };
                ProjectConfiguration = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [Object])
                ], ProjectConfiguration);
                return ProjectConfiguration;
            }());
            exports_1("ProjectConfiguration", ProjectConfiguration);
        }
    }
});
//# sourceMappingURL=project-configuration.js.map