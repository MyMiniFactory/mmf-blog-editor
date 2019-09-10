import { stateFromHTML } from 'draft-js-import-html';
import options from './html.options';

const HTMLtoState = (html) => {
    return stateFromHTML(html, options);
};

export default HTMLtoState;
