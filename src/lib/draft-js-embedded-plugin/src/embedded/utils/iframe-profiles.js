import React from "react";


export const ProfilesList = {
    'MMF': "mmf",
    'VIDEO': "video"
};

const commonStyle = {
    display: 'block',
    margin: '0px auto',
    overflow: 'hidden',
    border: 'none'
};


const mmfIframeProps = {
    "data-profile": ProfilesList.MMF,
    width: 242,
    height: 371,
    style: {
        ...commonStyle
    },
    scrolling: "no",
    allowtransparency: "true",
};

const videoIframeProps = {
    "data-profile": ProfilesList.VIDEO,
    width: 560,
    height: 315,
    style: {
        ...commonStyle
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
