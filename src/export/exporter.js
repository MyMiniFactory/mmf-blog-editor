import {convertToHTML, convertToMarkdown} from './index';

export default class EditorExporter {

    contentState = null;
    onUpdate = () => {
    };

    get html() {
        //Return the content in html
        if (this.contentState !== null) {
            return convertToHTML(this.contentState);
        }
    }

    get markdown() {
        //Return the content in html
        if (this.contentState !== null) {
            return convertToMarkdown(this.contentState);
        }
    }

    update(contentState) {
        this.contentState = contentState;
        this.onUpdate();
    }


}