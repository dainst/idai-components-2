System.register(['@angular/core/testing', "../app/object-edit/relation-picker-group.component"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, relation_picker_group_component_1;
    /**
     * @author Thomas Kleinke
     */
    function main() {
        testing_1.describe('RelationPickerGroupComponent', function () {
            var object;
            var relationPickerGroupComponent;
            testing_1.beforeEach(function () {
                object = { "id": "id1", "identifier": "ob1", "title": "Object 1", "type": "Object" };
                relationPickerGroupComponent = new relation_picker_group_component_1.RelationPickerGroupComponent();
                relationPickerGroupComponent.object = object;
                relationPickerGroupComponent.field = { "field": "Above", "inverse": "Below" };
            });
            testing_1.it('should create an empty relation array if no relation array exists and a new relation is created', function () {
                relationPickerGroupComponent.createRelation();
                testing_1.expect(object["Above"].length).toBe(1);
                testing_1.expect(object["Above"][0]).toBe("");
            });
        });
    }
    exports_1("main", main);
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (relation_picker_group_component_1_1) {
                relation_picker_group_component_1 = relation_picker_group_component_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=relation-picker-group.component.spec.js.map