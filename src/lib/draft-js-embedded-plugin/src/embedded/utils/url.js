import { ProfilesList } from '../utils/iframe-profiles';

const YOUTUBEMATCH_URL = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
const VIMEOMATCH_URL = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;// eslint-disable-line no-useless-escape
const MMFMATCH_URL = /(?:https?:\/\/)?(?:www\.)?(?:myminifactory\.com)?(?:\/object\/3d-print-)(.*)\/?/;

const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/';
const VIMEO_PREFIX = 'https://player.vimeo.com/video/';
const MMF_PREFIX = 'https://www.myminifactory.com/object/card/';


/**
 * @param link
 * @returns {boolean}
 */
export function isYoutube(link) {
    return YOUTUBEMATCH_URL.test(link)
}

/**
 * @param link
 * @returns {boolean}
 */
export function isVimeo(link) {
    return VIMEOMATCH_URL.test(link)
}

/**
 * @param link
 * @returns {boolean}
 */
export function isMMF(link) {
    return MMFMATCH_URL.test(link)
}





/**
 * @param link
 * @returns {{id: string, profile: string, src: string, link: string}}
 */
export function getVideoInfos(link)
{
    if (isYoutube(link)) {
        return getYoutubeInfos(link);
    }
    if (isVimeo(link)) {
        return getVimeoInfos(link);
    }
    return undefined;
}


/**
 * @param link
 * @returns {{id: string, profile: string, src: string, link: string}}
 */
export function getYoutubeInfos(link) {
    const id = link && link.match(YOUTUBEMATCH_URL)[1];
    return {
        profile: ProfilesList.VIDEO,
        id: id,
        src: `${YOUTUBE_PREFIX}${id}`,
        link,
    };
}

/**
 * @param link
 * @returns {{id: string, profile: string, src: string, link: string}}
 */
export function getVimeoInfos(link) {
    const id = link.match(VIMEOMATCH_URL)[3];
    return {
        profile: ProfilesList.VIDEO,
        id: id,
        src: `${VIMEO_PREFIX}${id}`,
        link,
    };
}

/**
 * @param link
 * @returns {{id: string, profile: string, src: string, link: string}}
 */
export function getMMFInfos(link)
{
    if (isMMF(link)) {
        //TODO ping to see if it exists (not 404)
        const id = link.match(MMFMATCH_URL)[1];
        return {
            profile: ProfilesList.MMF,
            id: id,
            src: `${MMF_PREFIX}${id}`,
            link,
        };
    }
    return undefined;
}

