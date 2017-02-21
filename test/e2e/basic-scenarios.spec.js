"use strict";
var protractor_1 = require("protractor");
describe('demo app', function () {
    beforeEach(function () {
        protractor_1.browser.get('/');
    });
    it('should find it by its identifier', function () {
        expect(protractor_1.element(protractor_1.by.tagName('a')) // the links to the demo pages
            .isPresent()).toBe(true);
    });
});
//# sourceMappingURL=basic-scenarios.spec.js.map