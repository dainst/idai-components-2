import {describe,xdescribe, expect, fit, it, xit, beforeEach} from '@angular/core/testing';
import {RelationPickerGroupComponent} from "../app/object-edit/relation-picker-group.component";

/**
 * @author Thomas Kleinke
 */
export function main() {
    describe('RelationPickerGroupComponent', () => {

        var resource: any;
        var relationPickerGroupComponent: RelationPickerGroupComponent;

        beforeEach(() => {
            resource = { "id@": "id1", "identifier": "ob1", "type": "Object" };

            relationPickerGroupComponent = new RelationPickerGroupComponent();
            relationPickerGroupComponent.resource = resource;
            relationPickerGroupComponent.field = { "field": "Above", "inverse": "Below" };
        });

        it('should create an empty relation array if no relation array exists and a new relation is created',
            function() {
                relationPickerGroupComponent.createRelation();

                expect(resource["Above"].length).toBe(1);
                expect(resource["Above"][0]).toBe("");
            }
        );
    });

}