import {browser,protractor,element,by} from 'protractor'

describe('demo app', function() {

    beforeEach(function(){
        browser.get('/');
    });

    it('should find it by its identifier', function() {
        expect(element(by.tagName('a')) // the links to the demo pages
            .isPresent()).toBe(true);
    });
});