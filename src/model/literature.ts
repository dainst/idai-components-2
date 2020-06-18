/**
 * @author Thomas Kleinke
 */
export interface Literature {

    quotation: string;
    zenonId?: string;
}


export module Literature {

    export const QUOTATION = 'quotation';
    export const ZENON_ID = 'zenonId';

    const VALID_FIELDS = [QUOTATION, ZENON_ID];

    export function generateLabel(literature: Literature, getTranslation: (key: string) => string): string {

        return literature.quotation + (literature.zenonId
            ? ' ('
            + getTranslation('zenonId')
            + ': ' + literature.zenonId + ')'
            : '');
    }


    export function isValid(literature: Literature): boolean {

        for (const fieldName in literature) {
            if (!VALID_FIELDS.includes(fieldName)) return false;
        }

        return literature.quotation !== undefined && literature.quotation.length > 0;
    }
}
