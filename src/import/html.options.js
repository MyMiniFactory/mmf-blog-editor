import {getIframeProperties} from '../lib/draft-js-embedded-plugin/src/embedded/utils/iframe-profiles'
import * as types from "../lib/draft-js-embedded-plugin/src/embedded/constants"

export default {

    customInlineFn: (element, {Style, Entity}) => {

        if (element.tagName === 'IFRAME') {
            return Entity(types.EMBEDDED_TYPE, {
                src: element.getAttribute('src'),
                profile: element.dataset.profile
            });
        }
        else if (element.tagName === 'IMG') {
            return Entity('IMAGE', {
                src: element.getAttribute('src'),
                alignment: element.dataset.alignment
            });
        }

    },
};