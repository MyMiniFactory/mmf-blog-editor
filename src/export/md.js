import { draftToMarkdown } from 'markdown-draft-js';
import {convertToRaw} from 'draft-js';
import options from './md.options'

const toMD = (contentState) => {
    return draftToMarkdown(convertToRaw(contentState), options);
};

export default toMD;