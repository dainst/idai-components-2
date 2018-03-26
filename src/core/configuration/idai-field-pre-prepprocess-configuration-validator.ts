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

export class IdaiFieldPrePreprocessConfigurationValidator {


    /**
     * Starting with 2.1.8 of idai-field we forbid visible and editable
     * to be configured by the user directly via Configuration.json.
     * Instead we offer to configure that separately wie Hidden.json.
     *
     * This is to reduce the necessity to have different configurations which have to be
     * tracked, when the only thing they differ in is the visitiliy/editability settings.
     */
    public go(appConfiguration: any): Array<Array<string>> {

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
        return IdaiFieldPrePreprocessConfigurationValidator.checkForForbiddenIsRecordedIns(appConfiguration)
                .concat(IdaiFieldPrePreprocessConfigurationValidator.checkForExtraneousFields(appConfiguration));
    }


    private static checkForExtraneousFields(appConfiguration: any): Array<Array<string>> {

        const allowedFields = ['domain', 'range', 'name', 'label', 'inverse', 'sameOperation'];

        return appConfiguration.relations
            .reduce((errs: Array<Array<string>>, relation: RelationDefinition) => {

                if (subtract(allowedFields)(Object.keys(relation)).length > 0) {
                    errs.push(["relation field not allowed", relation.name]);
                }
                return errs;

            }, []);
    }


    private static checkForForbiddenIsRecordedIns(appConfiguration: any): Array<Array<string>> {

        const errs = appConfiguration.relations
            .filter((relation: RelationDefinition) => relation.name === 'isRecordedIn')
            .reduce((errs: Array<Array<string>>, relation: RelationDefinition) => {

                const err = this.evaluateRelationDomain(relation, appConfiguration);
                if (err) errs.push(err);
                return errs;

            }, []);

        return errs ? errs : [];
    }


    private static evaluateRelationDomain(relation: RelationDefinition, appConfiguration: any) {

        if (intersection([relation.domain, this.imageTypes(appConfiguration)]).length > 0) {
            return (['image type/ isRecordedIn must not be defined manually', relation] as any);

        } else if (intersection([relation.domain, this.operationSubtypes(appConfiguration)]).length > 0) {
            return ['operation subtype as domain type/ isRecordedIn must not be defined manually', relation] as any;
        } else {

            if (subtract(this.operationSubtypes(appConfiguration))(relation.domain).length > 0) {
                for (let rangeType of relation.range) {
                    if (!this.operationSubtypes(appConfiguration).includes(rangeType)) {
                        return ['isRecordedIn - only operation subtypes allowed in range', relation] as any;
                    }
                }
            }
        }
    }


    private static operationSubtypes(appConfiguration: any) {

        return appConfiguration.types
            .filter((type: TypeDefinition) => type.parent === 'Operation')
            .map((type: TypeDefinition) => type.type);
    }


    private static imageTypes(appConfiguration: any) {

        return appConfiguration.types
            .filter((type: TypeDefinition) => type.parent === 'Image')
            .map((type: TypeDefinition) => type.type)
            .concat(['Image']);
    }
}