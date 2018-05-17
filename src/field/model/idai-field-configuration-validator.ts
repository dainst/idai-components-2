import {ConfigurationValidator} from '../../core/configuration/configuration-validator';
import {RelationDefinition} from '../../core/configuration/relation-definition';
import {TypeDefinition} from '../../core/configuration/type-definition';
import {ConfigurationDefinition} from '../../core/configuration/configuration-definition';
import {ConfigurationErrors} from '../../core/configuration/configuration-errors';


/**
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
export class IdaiFieldConfigurationValidator extends ConfigurationValidator{


    protected custom(configuration: ConfigurationDefinition) {

        let msgs: any[] = [];

        const mandatoryRelationsError = IdaiFieldConfigurationValidator.
            validateMandatoryRelations(configuration.relations as any, configuration.types);
        if (mandatoryRelationsError.length) msgs = msgs.concat(mandatoryRelationsError);

        return msgs;
    }


    /**
     * idai-field projects must have one or more types whose isRecordedIn relation
     * points to the Project Type. For each of these types, there must be at least
     * one type pointing to it with the isRecordedIn relation. This is nececarry
     * for the views to work
     *
     * @param relations
     * @param types
     * @returns {Array}
     */
    private static validateMandatoryRelations(relations: Array<RelationDefinition>,
                                              types: Array<TypeDefinition>): Array<Array<string>> {

        let msgs = [] as any;

        let recordedInRelations: any = {};
        if (relations) for (let relation of relations) {
            if (relation.name == 'isRecordedIn') {
                for (let type of relation.range) {
                    recordedInRelations[type] = relation.domain;
                }
            }
        }

        for (let type of recordedInRelations['Project']) {

            let isAbstract = false;
            for (let t of types) {
                if (t.type == type && t.abstract) {
                    isAbstract = true;
                }
            }
            if (isAbstract) continue;

            if (!(type in recordedInRelations) || !recordedInRelations[type]
                || recordedInRelations[type].length == 0) {
                msgs.push([ConfigurationErrors.VALIDATION_ERROR_INCOMPLETERECORDEDIN, type] as never);
            }
        }

        return msgs;
    }
}