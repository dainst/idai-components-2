"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var config_loader_1 = require("../../../../src/core/configuration/config-loader");
var idai_field_pre_prepprocess_configuration_validator_1 = require("../../../../src/core/configuration/idai-field-pre-prepprocess-configuration-validator");
/**
 * @author Daniel de Oliveira
 */
describe('ConfigLoader', function () {
    var configuration = {};
    var configLoader;
    var configReader;
    beforeEach(function () {
        configReader = jasmine.createSpyObj('confRead', ['read']);
        configReader.read.and.returnValue(Promise.resolve(configuration));
        configLoader = new config_loader_1.ConfigLoader(configReader);
    });
    it('mix extisting externally configured with internal inherits rel', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var pconf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Object.assign(configuration, {
                        identifier: 'Conf',
                        types: [
                            { type: 'A' },
                            { type: 'B' },
                            { type: 'C' },
                            { type: 'D' },
                            { type: 'A1', parent: 'A' },
                            { type: 'A2', parent: 'A' },
                            { type: 'B1', parent: 'B' },
                            { type: 'B2', parent: 'B' },
                        ],
                        relations: [{
                                name: 'connection',
                                domain: ['C'],
                                range: ['D']
                            }]
                    });
                    return [4 /*yield*/, configLoader.go('yo', [], [{
                                name: 'connection',
                                domain: ['A:inherit'],
                                range: ['B:inherit']
                            }], [], new idai_field_pre_prepprocess_configuration_validator_1.IdaiFieldPrePreprocessConfigurationValidator(), undefined)];
                case 1:
                    pconf = _a.sent();
                    expect(pconf.getRelationDefinitions('A')[0].range).toContain('B1');
                    expect(pconf.getRelationDefinitions('A1')[0].range).toContain('B');
                    expect(pconf.getRelationDefinitions('A2')[0].range).toContain('B2');
                    expect(pconf.getRelationDefinitions('C')[0].range).toContain('D');
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('preprocess - convert sameOperation to sameMainTypeResource', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var pconf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Object.assign(configuration, {
                        identifier: 'Conf',
                        types: [{ type: 'A' }],
                        relations: [{
                                name: 'abc',
                                domain: ['A'],
                                sameOperation: false
                            }]
                    });
                    return [4 /*yield*/, configLoader.go('yo', [], [], [], new idai_field_pre_prepprocess_configuration_validator_1.IdaiFieldPrePreprocessConfigurationValidator(), undefined)];
                case 1:
                    pconf = _a.sent();
                    expect(pconf.getRelationDefinitions('A')[0].sameMainTypeResource)
                        .toBe(false);
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('preprocess - apply language confs', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var pconf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Object.assign(configuration, {
                        identifier: 'Conf',
                        types: [
                            { type: 'A' },
                            { type: 'B' },
                            { type: 'C' }
                        ],
                        relations: [
                            { name: 'r1', domain: ['A'] },
                            { name: 'r2', domain: ['A'] }
                        ]
                    });
                    configReader.read.and.returnValues(Promise.resolve(configuration), Promise.resolve({}), Promise.resolve({}), Promise.resolve({
                        types: {
                            A: { label: 'A_' },
                            B: { label: 'B_' }
                        },
                        relations: {
                            r1: { label: 'r1_' }
                        }
                    }), Promise.resolve({
                        types: {
                            B: { label: 'B__' }
                        }
                    }));
                    return [4 /*yield*/, configLoader.go('yo', [], [], [], new idai_field_pre_prepprocess_configuration_validator_1.IdaiFieldPrePreprocessConfigurationValidator(), undefined)];
                case 1:
                    pconf = _a.sent();
                    expect(pconf.getTypesList()[0].label).toEqual('A_');
                    expect(pconf.getTypesList()[1].label).toEqual('B__');
                    expect(pconf.getTypesList()[2].label).toEqual('C'); // took name as label
                    expect(pconf.getRelationDefinitions('A')[0].label).toEqual('r1_');
                    expect(pconf.getRelationDefinitions('A')[1].label).toBeUndefined();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=config-loader.spec.js.map