import {RelationPickerGroupComponent} from "../../../src/core/documents/docedit/relation-picker-group.component";

/**
 * @author Thomas Kleinke
 */
export function main() {
    describe('RelationPickerGroupComponent', () => {

        var document: any;
        var relationPickerGroupComponent: RelationPickerGroupComponent;

        beforeEach(() => {
            document = { "resource" : 
                { "id": "id1", "identifier": "ob1", "type": "object", "relations" : {} }
            };

            relationPickerGroupComponent = new RelationPickerGroupComponent();
            relationPickerGroupComponent.document = document;
            relationPickerGroupComponent.relationDefinition = { "name": "Above", "inverse": "Below" };
        });

        it('should create an empty relation array if no relation array exists and a new relation is created',
            function() {
                relationPickerGroupComponent.ngOnChanges();
                relationPickerGroupComponent.createRelation();

                expect(document['resource']['relations']['Above'].length).toBe(1);
                expect(document['resource']['relations']['Above'][0]).toBe("");
            }
        );
    });

}