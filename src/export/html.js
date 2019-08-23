import { stateToHTML } from 'draft-js-export-html';
import options from './html.options';

const toHTML = (contentState) => {
    return stateToHTML(contentState, options);
};

export default toHTML;
