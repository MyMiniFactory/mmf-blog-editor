import {getIframeProperties} from '../lib/embedded-plugin/src/embedded/utils/iframe-profiles'
import * as types from "../lib/embedded-plugin/src/embedded/constants"

export default {

    customInlineFn: (element, {Style, Entity}) => {

        if (element.tagName === 'IFRAME') {
            return Entity(types.EMBEDDED_TYPE, {
                src: element.getAttribute('src'),
                profile: element.dataset.profile,
                alignment: element.dataset.alignment
            });
        }
        else if (element.tagName === 'IMG') {
            let width = (element.style.width || "40") + "%";
            width = width.replace(/%+/,'%');
            return Entity('IMAGE', {
                src: element.getAttribute('src'),
                alignment: element.dataset.alignment,
                width
            });
        }

    },
};