System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SearchTermExtractor;
    return {
        setters:[],
        execute: function() {
            /**
             * @author Sebastian Cuy
             * @author Daniel de Oliveira
             */
            SearchTermExtractor = (function () {
                function SearchTermExtractor() {
                }
                SearchTermExtractor.prototype.extractTerms = function (object) {
                    var terms = [];
                    for (var property in object) {
                        if (!object.hasOwnProperty(property))
                            continue;
                        terms = terms.concat(this.extractProperty(object[property]));
                    }
                    return terms.map(function (term) { return term.toLowerCase(); });
                };
                SearchTermExtractor.prototype.extractProperty = function (prop) {
                    var terms = [];
                    if (this.isNonEmptyString(prop)) {
                        terms = terms.concat(this.tokenize(prop));
                    }
                    else if (prop.constructor === Array) {
                        terms = terms.concat(this.dissectArray(prop));
                    }
                    return terms;
                };
                SearchTermExtractor.prototype.dissectArray = function (any) {
                    var terms = [];
                    for (var _i = 0, any_1 = any; _i < any_1.length; _i++) {
                        var item = any_1[_i];
                        if (this.isNonEmptyString(item)) {
                            terms = terms.concat(this.tokenize(item));
                        }
                    }
                    return terms;
                };
                SearchTermExtractor.prototype.isNonEmptyString = function (any) {
                    return (typeof any == "string" && any.length > 0);
                };
                SearchTermExtractor.prototype.tokenize = function (string) {
                    return string.match(/\w+/g);
                };
                return SearchTermExtractor;
            }());
            exports_1("SearchTermExtractor", SearchTermExtractor);
        }
    }
});
