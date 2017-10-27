import {ConfigurationValidator} from '../configuration/configuration-validator';
import {RelationDefinition} from '../configuration/relation-definition';
import {TypeDefinition} from '../configuration/type-definition';
import {MDInternal} from '../messages/md-internal';
import {ConfigurationDefinition} from '../configuration/configuration-definition';
import {ViewDefinition} from './view-definition';


/**
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
export class IdaiFieldConfigurationValidator extends ConfigurationValidator{


    protected custom(configuration: ConfigurationDefinition) {

        let msgs: any[] = [];

        if (configuration.views) {
            const missingViewTypeErrors = IdaiFieldConfigurationValidator.findMissingViewType(configuration.views, configuration.types);
            if (missingViewTypeErrors) msgs = msgs.concat(missingViewTypeErrors);
        }

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

        let msgs = [];

        let recordedInRelations: any = {};
        if (relations) for (let relation of relations) {
            if (relation.name == 'isRecordedIn') {
                for (let type of relation.range) {
                    recordedInRelations[type] = relation.domain;
                }
            }
        }

        if ('Project' in recordedInRelations) {
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
                    msgs.push([MDInternal.VALIDATION_ERROR_INCOMPLETERECORDEDIN, type]);
                }
            }
        } else {
            msgs.push([MDInternal.VALIDATION_ERROR_NOPROJECTRECORDEDIN]);
        }

        return msgs;
    }


    /**
     * idai-field projects have view configurations. their they must refer to
     * existing subtypes of operation. we want to avoid having views for other
     * types than operation types in order to have a real domain model foundation
     * on which the isRecordedIn relation later get created.
     *
     * @param views
     * @param types
     * @returns {Array}
     */
    private static findMissingViewType(
        views: Array<ViewDefinition>,
        types: Array<TypeDefinition>): Array<Array<string>> {

        let msgs = [];
        const typeNames: Array<string> = types.map(type => type.type);

        for (let view of views) {

            if (view.operationSubtype == 'Project') continue;
            if (typeNames.indexOf(view.operationSubtype) == -1)
                msgs.push([MDInternal.VALIDATION_ERROR_MISSINGVIEWTYPE, view.operationSubtype]);

            let supported = false;
            for (let type of types) {
                if (view.operationSubtype == type.type &&
                    type.parent == 'Operation') supported = true
            }
            if (!supported) {
                msgs.push([MDInternal.VALIDATION_ERROR_NONOPERATIONVIEWTYPE, view.operationSubtype]);
            }
        }
        return msgs;
    }
}