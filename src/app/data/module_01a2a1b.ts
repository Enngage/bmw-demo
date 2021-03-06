
import { ContentItem, Elements } from '@kentico/kontent-delivery';
import { Chapter } from './chapter';

/**
 * Generated by '@kentico/kontent-model-generator@3.2.0'
 * Tip: You can replace 'ContentItem' with another generated class to fully leverage strong typing.
 */
export class Module extends ContentItem {
    public title: Elements.TextElement;
    public selectChapters: Elements.LinkedItemsElement<Chapter>;
    public shortSummary: Elements.RichTextElement;
    constructor() {
        super({
            propertyResolver: ((elementName: string) => {
                if (elementName === 'select_chapters') {
                    return 'selectChapters';
                }
                if (elementName === 'short_summary') {
                    return 'shortSummary';
                }
                return elementName;
            })
        });
    }
}
