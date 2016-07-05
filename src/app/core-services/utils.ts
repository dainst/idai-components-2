/**
* @author Thomas Kleinke
*/
export class Utils {

    /**
     * @param id
     * @returns the type if the id is valid. Otherwise <code>undefined</code> is returned.
     */
    public static getTypeFromId(id: string): string {
        var splitId = id.split("/");
        if (splitId.length < 3)
            return undefined;
        else
            return splitId[1];
    }
}