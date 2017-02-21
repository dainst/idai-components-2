"use strict";
var protractor_1 = require("protractor");
var edit_page_1 = require("./edit.page");
var EC = protractor_1.protractor.ExpectedConditions;
var delays = require('../config/delays');
/**
 * @author Daniel de Oliveira
 */
describe('documents package - - - ', function () {
    beforeEach(function () {
        protractor_1.browser.get('/#/edit');
    });
    it('should suggest relations as long as they are not already set', function () {
        edit_page_1.EditPage.selectFirstDocument();
        edit_page_1.EditPage.getRelation(3, edit_page_1.EditPage._addRelation).click();
        edit_page_1.EditPage.getRelation(3, edit_page_1.EditPage._input).sendKeys('/demo/');
        expect(edit_page_1.EditPage.getRelationItems(3).get(0).getText()).toBe("/demo/5");
        edit_page_1.EditPage.getRelation(3, edit_page_1.EditPage._input).sendKeys(protractor_1.protractor.Key.ENTER);
        edit_page_1.EditPage.getRelation(3, edit_page_1.EditPage._addRelation).click();
        edit_page_1.EditPage.getRelation(3, edit_page_1.EditPage._input).sendKeys('/demo/');
        expect(edit_page_1.EditPage.getRelationItems(3).get(0).getText()).toBe("/demo/6");
        expect(edit_page_1.EditPage.getRelationItems(3).get(1).getText()).toBe("/demo/7");
    });
});
//# sourceMappingURL=relations.spec.js.map