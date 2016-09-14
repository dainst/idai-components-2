/*
 * In order to prevent errors caused by e2e tests running too fast you can slow them down by calling the following
 * function. Use higher values for slower tests.
 *
 * utils.delayPromises(50);
 */
describe('demo app', function() {

    beforeEach(function(){
        browser.get('/');
    });

    it('should find it by its identifier', function() {
        expect(element(by.tagName('a')) // the links to the demo pages
            .isPresent()).toBe(true);
    });
});