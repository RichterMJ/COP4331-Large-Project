import buildPath from "../path";

async function postJSON(json,url) {
    try {
        const response = await fetch(buildPath(url), {
            method: "POST",
            body: json,
            headers: {"Content-Type": "application/json"},
        });
    
        return JSON.parse(await response.text());
        
        // console.log(res); print out api response too see the data
    } catch (e) {
        console.log(e.toString());
        return;
    }
}
export default postJSON;