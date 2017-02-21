"use strict";
var protractor_1 = require("protractor");
var EC = protractor_1.protractor.ExpectedConditions;
var delays = require('../config/delays');
/**
 * @author Daniel de Oliveira
 */
var EditPage = (function () {
    function EditPage() {
    }
    // constants
    EditPage.relation_ = function (relationIndex) {
        return 'relations-form .list-group-item:nth-child(' + relationIndex + ') relation-picker-group';
    };
    return EditPage;
}());
// locators
EditPage.getRelation = function (relationIndex, fun) {
    protractor_1.browser.wait(EC.visibilityOf(protractor_1.element(protractor_1.by.css(EditPage.relation_(relationIndex)))), delays.ECWaitTime);
    return protractor_1.element(protractor_1.by.css(EditPage.relation_(relationIndex))).element(fun());
};
EditPage.getRelationItems = function (relationIndex) {
    protractor_1.browser.wait(EC.visibilityOf(protractor_1.element.all(protractor_1.by.css(EditPage.relation_(relationIndex) + ' .suggestion')).first()), delays.ECWaitTime);
    return protractor_1.element.all(protractor_1.by.css(EditPage.relation_(relationIndex) + ' .suggestion'));
};
EditPage.selectFirstDocument = function () {
    return protractor_1.element.all(protractor_1.by.css('button')).first().click();
};
// selectors
EditPage._addRelation = function () {
    return protractor_1.by.css('.add-relation');
};
EditPage._input = function () {
    return protractor_1.by.css('input');
};
exports.EditPage = EditPage;
//# sourceMappingURL=edit.page.js.map