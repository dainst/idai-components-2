import {browser,protractor,element,by} from 'protractor'
const EC = protractor.ExpectedConditions;
const delays = require('../config/delays');

/**
 * @author Daniel de Oliveira
 */
export class EditPage {

    // constants

    private static relation_(relationIndex) {
        return 'relations-form .list-group-item:nth-child('+relationIndex+') relation-picker-group';
    }

    // locators

    public static getRelation = function (relationIndex, fun) {
        browser.wait(EC.visibilityOf(element(by.css(EditPage.relation_(relationIndex)))), delays.ECWaitTime);
        return element(by.css(EditPage.relation_(relationIndex))).element(fun())
    };

    public static getRelationItems = function (relationIndex) {
        return element.all(by.css(EditPage.relation_(relationIndex)+' .suggestion'))
    };

    public static selectFirstDocument = function() {
        return element.all(by.css('button')).first().click();
    };

    // selectors

    public static _addRelation = function () {
        return by.css('.add-relation');
    };

    public static _input = function () {
        return by.css('input');
    };

}