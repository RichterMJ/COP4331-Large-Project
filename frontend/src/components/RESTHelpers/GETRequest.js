import React, { PureComponent } from 'react';
import buildPath from "../path";
async function GETRequest(url){
    try {
        const response = await fetch(buildPath(url), {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
            mode: 'cors'
        });
    
        return JSON.parse(await response.text());
        
    } catch (e) {
        console.log(e.toString());
        return;
    }
}
export default GETRequest;