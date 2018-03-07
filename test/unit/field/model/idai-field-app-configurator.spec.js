"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var idai_field_app_configurator_1 = require("../../../../src/field/model/idai-field-app-configurator");
var config_loader_1 = require("../../../../src/core/configuration/config-loader");
/**
 * @author Daniel de Oliveira
 */
describe('IdaiFieldAppConfigurator', function () {
    it('should run', function (done) {
        var http = jasmine.createSpyObj('http', ['get']);
        http.get.and.returnValue({ subscribe: function (cb) {
                cb({ "_body": JSON.stringify({
                        types: [
                            { type: "ConcreteOperation", parent: 'Operation' },
                            { type: "B" },
                        ],
                        relations: [
                            { name: 'isRecordedIn', domain: ['B'], label: "Gehört zu",
                                range: ['ConcreteOperation'], inverse: 'NO-INVERSE', visible: false, editable: false },
                        ]
                    }) });
            } });
        var configLoader = new config_loader_1.ConfigLoader(http);
        new idai_field_app_configurator_1.IdaiFieldAppConfigurator(configLoader).go('democonf', undefined);
        configLoader.getProjectConfiguration().then(function (projectConfiguration) {
            expect(projectConfiguration.getRelationDefinitions("ConcreteOperation")
                .filter(function (dfn) { return dfn.name == 'isRecordedIn'; })[0].range[0])
                .toEqual('Project');
            done();
        }).catch(function (e) { return fail(e); });
    });
});
//# sourceMappingURL=idai-field-app-configurator.spec.js.map