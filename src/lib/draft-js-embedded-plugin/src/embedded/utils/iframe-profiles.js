import React from "react";


export const ProfilesList = {
    'MMF': "mmf",
    'VIDEO': "video"
};


const mmfIframeProps = {
    width: 242,
    height: 371,
    style: {
        overflow: 'hidden',
        border: 'none'
    },
    scrolling: "no",
    allowtransparency: "true",
};

const videoIframeProps = {
    width: 560,
    height: 315,
    style: {
        overflow: 'hidden',
        border: 'none'
    },
    allowFullScreen: true,
    allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
};


export function getIframeProperties(profile, htmlProperties = false) {

    let props;
    switch (profile) {
        case ProfilesList.MMF:
            props = mmfIframeProps;
            break;
        case ProfilesList.VIDEO:
            props = videoIframeProps;
            break;
        default:
            props = {};
            break;
    }

    if (htmlProperties === true) {
        let lowercaseProps = {};
        for (let p in props) {
            lowercaseProps[p.toLowerCase()] = props[p];
        }
        return lowercaseProps;
    }

    return props;
}
