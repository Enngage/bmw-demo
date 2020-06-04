
import { ContentItem, Elements } from '@kentico/kontent-delivery';
import { CourseNew } from './course_new';

/**
 * Generated by '@kentico/kontent-model-generator@3.2.0'
 * Tip: You can replace 'ContentItem' with another generated class to fully leverage strong typing.
 */
export class Training extends ContentItem {
    public metaTitle: Elements.TextElement;
    public metadataMetaDescription: Elements.TextElement;
    public shortDescription: Elements.RichTextElement;
    public metadataKeyWords: Elements.TextElement;
    public lastModified: Elements.DateTimeElement;
    public friendlyUrl: Elements.UrlSlugElement;
    public courses: Elements.LinkedItemsElement<CourseNew>;
    public geography: Elements.TaxonomyElement;
    public author: Elements.LinkedItemsElement<ContentItem>;
    constructor() {
        super({
            propertyResolver: ((elementName: string) => {
                if (elementName === 'meta_title') {
                    return 'metaTitle';
                }
                if (elementName === 'metadata__meta_description') {
                    return 'metadataMetaDescription';
                }
                if (elementName === 'short_description') {
                    return 'shortDescription';
                }
                if (elementName === 'metadata__key_words') {
                    return 'metadataKeyWords';
                }
                if (elementName === 'last_modified') {
                    return 'lastModified';
                }
                if (elementName === 'friendly_url') {
                    return 'friendlyUrl';
                }
                return elementName;
            })
        });
    }
}