/**
 * Used to validate to configuration in the form it comes from the user, i.e.
 * as Configuration.json. This means before the preprocess step has been executed,
 * where additional hardcoded definitions from app configurators may come in.
 *
 * @author Daniel de Oliveira
 */
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

        let errs: string[][] = [];
        for (let type of appConfiguration.types) {
            if (type.fields) {
                for (let field of type.fields) {
                    if (field.editable != undefined) errs.push(['field.editable/forbidden configuration',field] as never);
                    if (field.visible != undefined) errs.push(['field.visible/forbidden configuration',field] as never);
                }
            }
        }

        return errs;
    }
}