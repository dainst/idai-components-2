import {ProjectConfiguration} from "../../../src/app/configuration/project-configuration";
import {ConnectedDocsResolver} from "../../../src/app/persist/connected-docs-resolver";

/**
 * @author Daniel de Oliveira
 */
export function main() {
    describe('ConnectedDocsResolver', () => {

        const projectConfiguration = new ProjectConfiguration({
            "types": [
                {
                    "type": "object",
                    "fields": []
                }
            ],
            "relations": [
                {
                    "name": "BelongsTo",
                    "inverse": "Contains",
                    "label": "Enthalten in"
                },
                {
                    "name": "Contains",
                    "inverse": "BelongsTo",
                    "label": "Enthält"
                },
                {
                    "name": "OneWay",
                    "inverse": "NO-INVERSE",
                    "label": "Einweg"
                }
            ]
        });

        let doc;
        let relatedDoc;
        let connectedDocsResolver;

        beforeEach(()=>{
            doc = { "resource" : {
                "id" :"1", "identifier": "ob1",
                "type": "object",
                "relations" : {}
            }};
            relatedDoc = { "resource" : {
                "id": "2" , "identifier": "ob2",
                "type": "object",
                "relations" : {}
            }};
        });

        it('should return one',
            () => {
                connectedDocsResolver = new ConnectedDocsResolver(projectConfiguration);

                doc.resource.relations['BelongsTo'] = ["2"];
                relatedDoc.resource.relations['Contains'] = ["1"];

                const docsToUpdate =
                    connectedDocsResolver.determineDocsToUpdate(doc.resource,[relatedDoc],true);

                expect(docsToUpdate).toEqual([relatedDoc]);
            }
        );
    });
}