import {createContext} from 'react';

const ComponentContext = createContext({});

/**
 * @param obj
 * @param propList
 */
const extractFromObj = (obj, propList) => {
    let newObj = {};
    for(let propName of propList ){
        if(obj.hasOwnProperty(propName)) newObj[propName] = obj[propName];
    }
    return newObj;
};



export { ComponentContext as default, extractFromObj as createContextValue};