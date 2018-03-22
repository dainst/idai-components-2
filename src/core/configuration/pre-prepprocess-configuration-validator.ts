/**
 * Used to validate to configuration in the form it comes from the user, i.e.
 * as Configuration.json. This means before the preprocess step has been executed,
 * where additional hardcoded definitions from app configurators may come in.
 *
 * @author Daniel de Oliveira
 */
import {TypeDefinition} from './type-definition';
import {intersection, subtract} from 'tsfun';
import {RelationDefinition} from './relation-definition';

export module PrePrepprocessConfigurationValidator {


    /**
     * Starting with 2.1.8 of idai-field we forbid visible and editable
     * to be configured by the user directly via Configuration.json.
     * Instead we offer to configure that separately wie Hidden.json.
     *
     * This is to reduce the necessity to have different configurations which have to be
     * tracked, when the only thing they differ in is the visitiliy/editability settings.
     */
    export function go(appConfiguration: any): Array<Array<string>> {

        if (!appConfiguration.types) return [];

        // let errs: string[][] = [];
        // for (let type of appConfiguration.types) {
        //     if (type.fields) {
        //         for (let field of type.fields) {
        //             if (field.editable != undefined) errs.push(['field.editable/forbidden configuration',field] as never);
        //             if (field.visible != undefined) errs.push(['field.visible/forbidden configuration',field] as never);
        //         }
        //     }
        // }
        return checkForForbiddenIsRecordedIns(appConfiguration)
                .concat(checkForExtraneousFields(appConfiguration));
    }


    function checkForExtraneousFields(appConfiguration: any): Array<Array<string>> {

        const allowedFields = ['domain', 'range', 'name', 'label', 'inverse'];

        return appConfiguration.relations
            .reduce((errs: Array<Array<string>>, relation: RelationDefinition) => {

                if (subtract(allowedFields)(Object.keys(relation)).length > 0) {
                    errs.push(["relation field not allowed", relation.name]);
                }
                return errs;

            }, []);
    }


    function checkForForbiddenIsRecordedIns(appConfiguration: any): Array<Array<string>> {

        const errs = appConfiguration.relations
            .filter((relation: RelationDefinition) => relation.name === 'isRecordedIn')
            .reduce((errs: Array<Array<string>>, relation: RelationDefinition) => {

                if (intersection([relation.domain, operationSubtypes(appConfiguration)]).length > 0) {

                    errs.push(['operation subtype as domain type/ isRecordedIn must not be defined manually', relation] as any);

                } else {

                    if (subtract(operationSubtypes(appConfiguration))(relation.domain).length > 0) {
                        for (let rangeType of relation.range) {
                            if (!operationSubtypes(appConfiguration).includes(rangeType)) {
                                errs.push(['isRecordedIn - only operation subtypes allowed in range', relation] as any);
                            }
                        }
                    }
                }


                return errs;

            }, []);

        return errs ? errs : [];
    }


    function operationSubtypes(appConfiguration: any) {

        return appConfiguration.types
            .filter((type: TypeDefinition) => type.parent === 'Operation')
            .map((type: TypeDefinition) => type.type);
    }
}