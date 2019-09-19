/**
 * @author Daniel de Oliveira
 */
export class ConfigurationErrors {

    public static INVALID_CONFIG_DUPLICATETYPE = 'config/error/duplicatetype';
    public static INVALID_CONFIG_MULTIPLEUSEOFDATING = 'config/error/multipleuseofdating';
    public static INVALID_CONFIG_MISSINGPARENTTYPE = 'config/error/missingparenttype';
    public static INVALID_CONFIG_INVALIDTYPE = 'config/error/invalidtype';
    public static INVALID_CONFIG_MISSINGVALUELIST = 'config/error/missingvaluelist';
    public static INVALID_CONFIG_MISSINGFIELDNAME = 'config/error/missingfieldname';
    public static INVALID_CONFIG_MISSINGRELATIONTYPE = 'config/error/missingrelationtype';

    public static VALIDATION_ERROR_INVALIDINPUTTYPE = 'config/error/validationerrorinvalidinputtype';

    public static INVALID_CONFIG_NO_PARENT_ASSIGNED = 'config/fields/custom/noparentassigned';
    public static INVALID_CONFIG_PARENT_NOT_DEFINED = 'config/fields/custom/parentnotdefined';
    public static INVALID_CONFIG_PARENT_NOT_TOP_LEVEL = 'config/fields/custom/parentnotatopleveltype';
    public static NOT_AN_EXTENDABLE_TYPE = 'config/fields/custom/notanextendabletype';

    // Preprocessing
    public static DUPLICATE_TYPE_DEFINITION = 'configuration/error/duplicatetypedefinition';
    public static MISSING_REGISTRY_ID = 'configuration/error/missing_registry_id';
    public static DUPLICATION_IN_SELECTION = 'configuration/error/duplicationinselection';
    public static MUST_HAVE_PARENT = 'configuration/error/musthaveparent';
    public static MUST_HAVE_TYPE_FAMILY = 'configuration/error/musthavetypefamily';
}