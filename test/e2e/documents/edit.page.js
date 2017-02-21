'use strict';
var EC = protractor.ExpectedConditions;
var delays = require('../config/delays');

/**
 * @author Daniel de Oliveira
 */
var EditPage = function() {

    this.getRelation = function (relationIndex, fun) {
        browser.wait(EC.visibilityOf(element(by.css('relations-form .list-group-item:nth-child('+relationIndex+') relation-picker-group'))), delays.ECWaitTime);
        return element(by.css('relations-form .list-group-item:nth-child('+relationIndex+') relation-picker-group')).element(fun())
    };

    this.getRelationItems = function (relationIndex) {
        return element.all(by.css('relations-form .list-group-item:nth-child('+relationIndex+') relation-picker-group .suggestion'))
    };

    this._relation = function() {
        return by.css('relations-form .list-group-item:nth-child('+relationIndex+') relation-picker-group');
    };

    this._addRelation = function () {
        return by.css('.add-relation');
    };

    this._input = function () {
        return by.css('input');
    };

    this.selectFirstDocument = function() {
        return element.all(by.css('button')).first().click();
    }
};

module.exports = new EditPage();