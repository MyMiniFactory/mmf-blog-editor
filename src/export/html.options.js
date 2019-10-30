//Export from the embedded plugin
import {getIframeProperties} from '../lib/embedded-plugin/src/embedded/utils/iframe-profiles'

export default {
    entityStyleFn: (entity) => {
        const entityType = entity.get('type').toLowerCase();
        if (entityType === 'mmf-embedded') {
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

        if (entityType === 'image') {
            const {src, width = 40, alignment = 'default'} = entity.getData();
            const style = {
                width: width + '%'
            };
            switch(alignment) {
                case "center":
                    style['display'] = 'block';
                    style['margin-left'] = 'auto';
                    style['margin-right'] = 'auto';
                    break;
                case "left":
                    style['float'] = 'left';
                    break;
                case "right":
                    style['float'] = 'right';
                    break;
                default:
                    style['margin'] = 'initial';
            }
            const attributes = {src, "data-alignment": alignment};
            return {
                element: 'img',
                style,
                attributes
            };
        }
    }
};