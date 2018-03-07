"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var relation_picker_group_component_1 = require("../../../../src/core/documents/docedit/relation-picker-group.component");
/**
 * @author Thomas Kleinke
 */
describe('RelationPickerGroupComponent', function () {
    var document;
    var relationPickerGroupComponent;
    beforeEach(function () {
        document = { "resource": { "id": "id1", "identifier": "ob1", "type": "object", "relations": {} }
        };
        relationPickerGroupComponent = new relation_picker_group_component_1.RelationPickerGroupComponent();
        relationPickerGroupComponent.document = document;
        relationPickerGroupComponent.relationDefinition = { "name": "Above", "inverse": "Below" };
    });
    it('should create an empty relation array if no relation array exists and a new relation is created', function () {
        relationPickerGroupComponent.ngOnChanges();
        relationPickerGroupComponent.createRelation();
        expect(document['resource']['relations']['Above'].length).toBe(1);
        expect(document['resource']['relations']['Above'][0]).toBe("");
    });
});
//# sourceMappingURL=relation-picker-group.component.spec.js.map