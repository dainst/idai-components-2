/**
 * @author Thomas Kleinke
 */
export interface Literature {

    quotation: string;
    zenonId?: string;
}


export module Literature {

    export function getLabel(literature: Literature, getTranslation: (key: string) => string): string {

        return literature.quotation + (literature.zenonId
            ? ' ('
            + getTranslation('zenonId')
            + literature.zenonId + ')'
            : '');
    }
}