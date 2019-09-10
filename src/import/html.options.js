import {getIframeProperties} from '../lib/draft-js-embedded-plugin/src/embedded/utils/iframe-profiles'

export default {

    customInlineFn: (element, {Style, Entity}) => {
        /*
        if (element.tagName === 'SPAN' && element.className === 'emphasis') {
            return Style('ITALIC');
        } else if (element.tagName === 'IMG') {
            return Entity('IMAGE', {src: element.getAttribute('src')});
        }
        */

        if (element.tagName === 'IFRAME') {

            let data = {};
            for(let a of element.attributes)
            {
                data[a.name] = a.value;
            }

            return Entity('IFRAME', data);
        }

    },
};