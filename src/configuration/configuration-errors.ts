/**
 * @author Daniel de Oliveira
 */
export class ConfigurationErrors { // TODO convert to module

    public static INVALID_CONFIG_DUPLICATETYPE = 'config/error/duplicatetype';
    public static INVALID_CONFIG_MULTIPLEUSEOFDATING = 'config/error/multipleuseofdating';
    public static INVALID_CONFIG_MISSINGPARENTTYPE = 'config/error/missingparenttype';
    public static INVALID_CONFIG_INVALIDTYPE = 'config/error/invalidtype';
    public static INVALID_CONFIG_MISSINGVALUELIST = 'config/error/missingvaluelist';
    public static INVALID_CONFIG_MISSINGFIELDNAME = 'config/error/missingfieldname';
    public static INVALID_CONFIG_MISSINGRELATIONTYPE = 'config/error/missingrelationtype';

    public static VALIDATION_ERROR_INVALIDINPUTTYPE = 'config/error/validationerrorinvalidinputtype';

    public static INVALID_CONFIG_PARENT_NOT_DEFINED = 'config/fields/custom/parentnotdefined';
    public static INVALID_CONFIG_PARENT_NOT_TOP_LEVEL = 'config/fields/custom/parentnotatopleveltype';
    public static NOT_AN_EXTENDABLE_TYPE = 'config/fields/custom/notanextendabletype';

    // mergeTypes
    public static DUPLICATION_IN_SELECTION = 'configuration/mergeTypes/duplicationinselection';
    public static MUST_HAVE_PARENT = 'configuration/mergeTypes/musthaveparent';
    public static MUST_HAVE_TYPE_FAMILY = 'configuration/mergeTypes/musthavetypefamily';
    public static MISSING_TYPE_PROPERTY = 'configuration/mergeTypes/missingTypeProperty';
    public static MISSING_FIELD_PROPERTY = 'configuration/mergeTypes/missingFieldProperty';
    public static MUST_NOT_SET_INPUT_TYPE = 'configuration/mergeTypes/mustNotSetInputType';
    public static ILLEGAL_FIELD_TYPE = 'configuration/mergeTypes/illegalFieldType';
}