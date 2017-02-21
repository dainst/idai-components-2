var EC = protractor.ExpectedConditions;
var delays = require('../config/delays');
var editPage = require('./edit.page');

/**
 * @author Daniel de Oliveira
 */
describe('documents package - - - ', function() {

    beforeEach(function(){
        browser.get('/#/edit');
    });

    fit('should find a relation', function() {
        editPage.selectFirstDocument();
        editPage.getRelation(3,editPage._addRelation).click();
        editPage.getRelation(3,editPage._input).sendKeys('/demo/5');
        editPage.getRelation(3,editPage._input).sendKeys(protractor.Key.ENTER);
        editPage.getRelation(3,editPage._addRelation).click();
        editPage.getRelation(3,editPage._input).sendKeys('/demo/5');
        expect(editPage.getRelationItems(3).get(0).getText()).not.toBe("/demo/5");
    });
});