import buildPath from "../path";

async function JSONRequest(method, json,url) {
    try {
        const response = await fetch(buildPath(url), {
            method: method,
            body: json,
            headers: {"Content-Type": "application/json"},
        });
    
        return JSON.parse(await response.text());
        
    } catch (e) {
        console.log(e.toString());
        return;
    }
}
async function JSONGETRequest(url){
    try {
        const response = await fetch(buildPath(url), {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });

        return JSON.parse(await response.text());

    } catch (e) {
        console.log(e.toString());
        return;
    }

}
export {JSONRequest, JSONGETRequest};
