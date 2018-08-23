"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var project_configuration_1 = require("./project-configuration");
var preprocessing_1 = require("./preprocessing");
var config_reader_1 = require("./config-reader");
var ConfigLoader = (function () {
    function ConfigLoader(configReader) {
        this.configReader = configReader;
    }
    ConfigLoader_1 = ConfigLoader;
    ConfigLoader.prototype.go = function (configDirPath, extraTypes, extraRelations, extraFields, extraFieldsOrder, prePreprocessConfigurationValidator, postPreprocessConfigurationValidator, applyMeninxConfiguration) {
        if (applyMeninxConfiguration === void 0) { applyMeninxConfiguration = false; }
        return __awaiter(this, void 0, void 0, function () {
            var appConfiguration, prePreprocessValidationErrors, postPreprocessValidationErrors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readConfiguration(configDirPath)];
                    case 1:
                        appConfiguration = _a.sent();
                        prePreprocessValidationErrors = prePreprocessConfigurationValidator.go(appConfiguration);
                        if (prePreprocessValidationErrors.length > 0)
                            throw prePreprocessValidationErrors;
                        return [4 /*yield*/, this.preprocess(configDirPath, appConfiguration, extraTypes, extraRelations, extraFields, extraFieldsOrder, applyMeninxConfiguration)];
                    case 2:
                        appConfiguration = _a.sent();
                        postPreprocessValidationErrors = postPreprocessConfigurationValidator.go(appConfiguration);
                        if (postPreprocessValidationErrors.length > 0)
                            throw postPreprocessValidationErrors;
                        return [2 /*return*/, new project_configuration_1.ProjectConfiguration(appConfiguration)];
                }
            });
        });
    };
    ConfigLoader.prototype.readConfiguration = function (configDirPath) {
        return __awaiter(this, void 0, void 0, function () {
            var appConfigurationPath, msgWithParams_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appConfigurationPath = configDirPath + '/Configuration.json';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.configReader.read(appConfigurationPath)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        msgWithParams_1 = _a.sent();
                        throw [[msgWithParams_1]];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ConfigLoader.prototype.preprocess = function (configDirPath, appConfiguration, extraTypes, extraRelations, extraFields, extraFieldsOrder, applyMeninxConfiguration) {
        return __awaiter(this, void 0, void 0, function () {
            var customFieldsConfigurationPath, meninxFieldsConfigurationPath, hiddenConfigurationPath, customHiddenConfigurationPath, languageConfigurationPath, customLanguageConfigurationPath, meninxLanguageConfigurationPath, orderConfigurationPath, searchConfigurationPath, periodConfigurationPath, meninxPeriodConfigurationPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customFieldsConfigurationPath = configDirPath + '/Fields-Custom.json';
                        meninxFieldsConfigurationPath = configDirPath + '/Fields-Meninx.json';
                        hiddenConfigurationPath = configDirPath + '/Hidden.json';
                        customHiddenConfigurationPath = configDirPath + '/Hidden-Custom.json';
                        languageConfigurationPath = configDirPath + '/Language.json';
                        customLanguageConfigurationPath = configDirPath + '/Language-Custom.json';
                        meninxLanguageConfigurationPath = configDirPath + '/Language-Meninx.json';
                        orderConfigurationPath = configDirPath + '/Order.json';
                        searchConfigurationPath = configDirPath + '/Search.json';
                        periodConfigurationPath = configDirPath + '/Periods.json';
                        meninxPeriodConfigurationPath = configDirPath + '/Periods-Meninx.json';
                        preprocessing_1.Preprocessing.prepareSameMainTypeResource(appConfiguration);
                        // TODO rename and test / also: it is idai field specific
                        // Preprocessing.setIsRecordedInVisibilities(appConfiguration); See #8992
                        return [4 /*yield*/, this.applyCustomFieldsConfiguration(appConfiguration, applyMeninxConfiguration ?
                                meninxFieldsConfigurationPath :
                                customFieldsConfigurationPath)];
                    case 1:
                        // TODO rename and test / also: it is idai field specific
                        // Preprocessing.setIsRecordedInVisibilities(appConfiguration); See #8992
                        _a.sent();
                        return [4 /*yield*/, this.applyHiddenConfs(appConfiguration, hiddenConfigurationPath, customHiddenConfigurationPath)];
                    case 2:
                        _a.sent();
                        if (!appConfiguration.relations)
                            appConfiguration.relations = [];
                        preprocessing_1.Preprocessing.addExtraTypes(appConfiguration, extraTypes);
                        preprocessing_1.Preprocessing.addExtraFields(appConfiguration, extraFields);
                        preprocessing_1.Preprocessing.addExtraRelations(appConfiguration, extraRelations);
                        preprocessing_1.Preprocessing.addExtraFields(appConfiguration, ConfigLoader_1.defaultFields);
                        return [4 /*yield*/, this.applyLanguageConfs(appConfiguration, languageConfigurationPath, applyMeninxConfiguration ?
                                meninxLanguageConfigurationPath :
                                customLanguageConfigurationPath)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.applySearchConfiguration(appConfiguration, searchConfigurationPath)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.applyPeriodConfiguration(appConfiguration, applyMeninxConfiguration
                                ? meninxPeriodConfigurationPath
                                : periodConfigurationPath)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, this.getOrderedConfiguration(appConfiguration, orderConfigurationPath, extraFieldsOrder)];
                }
            });
        });
    };
    ConfigLoader.prototype.applyCustomFieldsConfiguration = function (appConfiguration, customFieldsConfigurationPath) {
        return __awaiter(this, void 0, void 0, function () {
            var customConfiguration_1, msgWithParams_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configReader.read(customFieldsConfigurationPath)];
                    case 1:
                        customConfiguration_1 = _a.sent();
                        Object.keys(customConfiguration_1).forEach(function (typeName) {
                            preprocessing_1.Preprocessing.addCustomFields(appConfiguration, typeName, customConfiguration_1[typeName].fields);
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        msgWithParams_2 = _a.sent();
                        throw [[msgWithParams_2]];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ConfigLoader.prototype.applyLanguageConfs = function (appConfiguration, languageConfigurationPath, customLanguageConfigurationPath) {
        return __awaiter(this, void 0, void 0, function () {
            var languageConfiguration, msgWithParams_3, customLanguageConfiguration, msgWithParams_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configReader.read(languageConfigurationPath)];
                    case 1:
                        languageConfiguration = _a.sent();
                        preprocessing_1.Preprocessing.applyLanguage(appConfiguration, languageConfiguration); // TODO test it
                        return [3 /*break*/, 3];
                    case 2:
                        msgWithParams_3 = _a.sent();
                        throw [[msgWithParams_3]];
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.configReader.read(customLanguageConfigurationPath)];
                    case 4:
                        customLanguageConfiguration = _a.sent();
                        preprocessing_1.Preprocessing.applyLanguage(appConfiguration, customLanguageConfiguration); // TODO test it
                        return [3 /*break*/, 6];
                    case 5:
                        msgWithParams_4 = _a.sent();
                        throw [[msgWithParams_4]];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ConfigLoader.prototype.applySearchConfiguration = function (appConfiguration, searchConfigurationPath) {
        return __awaiter(this, void 0, void 0, function () {
            var searchConfiguration, msgWithParams_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configReader.read(searchConfigurationPath)];
                    case 1:
                        searchConfiguration = _a.sent();
                        preprocessing_1.Preprocessing.applySearchConfiguration(appConfiguration, searchConfiguration);
                        return [3 /*break*/, 3];
                    case 2:
                        msgWithParams_5 = _a.sent();
                        throw [[msgWithParams_5]];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ConfigLoader.prototype.applyPeriodConfiguration = function (appConfiguration, periodConfigurationPath) {
        return __awaiter(this, void 0, void 0, function () {
            var datingConfiguration, msgWithParams_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configReader.read(periodConfigurationPath)];
                    case 1:
                        datingConfiguration = _a.sent();
                        preprocessing_1.Preprocessing.applyPeriodConfiguration(appConfiguration, datingConfiguration);
                        return [3 /*break*/, 3];
                    case 2:
                        msgWithParams_6 = _a.sent();
                        throw [[msgWithParams_6]];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ConfigLoader.prototype.applyHiddenConfs = function (appConfiguration, hiddenConfigurationPath, customHiddenConfigurationPath) {
        return __awaiter(this, void 0, void 0, function () {
            var hiddenConfiguration, _1, customHiddenConfiguration, _2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configReader.read(hiddenConfigurationPath)];
                    case 1:
                        hiddenConfiguration = _a.sent();
                        ConfigLoader_1.hideFields(appConfiguration, hiddenConfiguration);
                        return [3 /*break*/, 3];
                    case 2:
                        _1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.configReader.read(customHiddenConfigurationPath)];
                    case 4:
                        customHiddenConfiguration = _a.sent();
                        ConfigLoader_1.hideFields(appConfiguration, customHiddenConfiguration);
                        return [3 /*break*/, 6];
                    case 5:
                        _2 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ConfigLoader.prototype.getOrderedConfiguration = function (appConfiguration, orderConfigurationPath, extraFieldsOrder) {
        return __awaiter(this, void 0, void 0, function () {
            var orderedConfiguration, orderConfiguration, msgWithParams_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configReader.read(orderConfigurationPath)];
                    case 1:
                        orderConfiguration = _a.sent();
                        ConfigLoader_1.addExtraFieldsOrder(appConfiguration, orderConfiguration, extraFieldsOrder);
                        orderedConfiguration = {
                            identifier: appConfiguration.identifier,
                            relations: appConfiguration.relations,
                            types: ConfigLoader_1.getOrderedTypes(appConfiguration, orderConfiguration)
                        };
                        return [3 /*break*/, 3];
                    case 2:
                        msgWithParams_7 = _a.sent();
                        throw [[msgWithParams_7]];
                    case 3: return [2 /*return*/, orderedConfiguration];
                }
            });
        });
    };
    ConfigLoader.addExtraFieldsOrder = function (appConfiguration, orderConfiguration, extraFieldsOrder) {
        if (!orderConfiguration.fields)
            orderConfiguration.fields = {};
        Object.keys(appConfiguration.types).forEach(function (typeName) {
            if (!orderConfiguration.fields[typeName])
                orderConfiguration.fields[typeName] = [];
            orderConfiguration.fields[typeName]
                = extraFieldsOrder.concat(orderConfiguration.fields[typeName]);
        });
    };
    ConfigLoader.getOrderedTypes = function (appConfiguration, orderConfiguration) {
        var _this = this;
        var types = [];
        if (orderConfiguration.types) {
            orderConfiguration.types.forEach(function (typeName) {
                var type = appConfiguration.types[typeName];
                if (type)
                    _this.addToOrderedTypes(type, typeName, types, orderConfiguration);
            });
        }
        Object.keys(appConfiguration.types).forEach(function (typeName) {
            if (!types.find(function (type) { return type.type === typeName; })) {
                _this.addToOrderedTypes(appConfiguration.types[typeName], typeName, types, orderConfiguration);
            }
        });
        return types;
    };
    ConfigLoader.addToOrderedTypes = function (type, typeName, types, orderConfiguration) {
        if (types.includes(type))
            return;
        type.type = typeName;
        type.fields = this.getOrderedFields(type, orderConfiguration);
        types.push(type);
    };
    ConfigLoader.getOrderedFields = function (type, orderConfiguration) {
        var _this = this;
        var fields = [];
        if (!type.fields)
            return fields;
        if (orderConfiguration.fields[type.type]) {
            orderConfiguration.fields[type.type].forEach(function (fieldName) {
                var field = type.fields[fieldName];
                if (field)
                    _this.addToOrderedFields(field, fieldName, fields);
            });
        }
        Object.keys(type.fields).forEach(function (fieldName) {
            if (!fields.find(function (field) { return field.name === fieldName; })) {
                _this.addToOrderedFields(type.fields[fieldName], fieldName, fields);
            }
        });
        return fields;
    };
    ConfigLoader.addToOrderedFields = function (field, fieldName, fields) {
        if (fields.includes(field))
            return;
        field.name = fieldName;
        fields.push(field);
    };
    ConfigLoader.hideFields = function (appConfiguration, hiddenConfiguration) {
        if (appConfiguration.types) {
            for (var _i = 0, _a = Object.keys(hiddenConfiguration); _i < _a.length; _i++) {
                var type = _a[_i];
                for (var _b = 0, _c = hiddenConfiguration[type]; _b < _c.length; _b++) {
                    var fieldToHide = _c[_b];
                    for (var i in appConfiguration.types) {
                        if (appConfiguration.types[i].type === type && appConfiguration.types[i].fields) {
                            for (var j in appConfiguration.types[i].fields) {
                                if (appConfiguration.types[i].fields[j].name === fieldToHide) {
                                    appConfiguration.types[i].fields[j].visible = false;
                                    appConfiguration.types[i].fields[j].editable = false;
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    ConfigLoader.defaultFields = {
        'id': {
            editable: false,
            visible: false
        },
        'type': {
            label: 'Typ',
            visible: false,
            editable: false
        }
    };
    ConfigLoader = ConfigLoader_1 = __decorate([
        core_1.Injectable()
        /**
         * Lets clients subscribe for the app
         * configuration. In order for this to work, they
         * have to call <code>go</code> and <code>getProjectConfiguration</code>
         *  (the call order does not matter).
         *
         * It is recommended to handle a promise rejection of
         * <code>getProjectConfiguration</code> at a single place in your app.
         *
         * @author Daniel de Oliveira
         * @author Thomas Kleinke
         * @author Fabian Z.
         */
        ,
        __metadata("design:paramtypes", [config_reader_1.ConfigReader])
    ], ConfigLoader);
    return ConfigLoader;
    var ConfigLoader_1;
}());
exports.ConfigLoader = ConfigLoader;
//# sourceMappingURL=config-loader.js.map