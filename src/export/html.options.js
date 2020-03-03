//Export from the embedded plugin
import {getIframeProperties} from '../lib/embedded-plugin/src/embedded/utils/iframe-profiles'

export default {
    entityStyleFn: (entity) => {

        const entityType = entity.get('type').toLowerCase();

        if (entityType === 'mmf-embedded') {
            const {profile, src, alignment = 'center'} = entity.getData();
            const {style: profileStyle, ...profileAttribute} = getIframeProperties(profile, true);
            const attributes = {src, "data-alignment": alignment, ...profileAttribute};
            const style = {
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                ...profileStyle};
            return {
                element: 'iframe',
                style,
                attributes
            };
        }

        if (entityType === 'image') {
            const {src, width = 40, alignment = 'center'} = entity.getData();
            const style = {
                width: width + '%',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto'
            };
            const attributes = {src, "data-alignment": alignment};
            return {
                element: 'img',
                style,
                attributes
            };
        }
    }
};