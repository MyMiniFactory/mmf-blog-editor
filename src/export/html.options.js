//Export from the embedded plugin
import {getIframeProperties} from '../lib/draft-js-embedded-plugin/src/embedded/utils/iframe-profiles'

export default {
    entityStyleFn: (entity) => {
        const entityType = entity.get('type').toLowerCase();
        if (entityType === 'draft-js-embedded-plugin-embedded') {
            const {profile, src} = entity.getData();
            const iframeProps = getIframeProperties(profile, true);
            const {style, ...attributes} = iframeProps;
            attributes.src = src;
            return {
                element: 'iframe',
                style,
                attributes
            };
        }
    }
};