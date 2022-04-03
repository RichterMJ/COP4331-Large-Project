import buildPath from "../path";

async function postJSON(json,url) {
    try {
        const response = await fetch(buildPath(url), {
            method: "POST",
            body: json,
            headers: {"Content-Type": "application/json"},
        });
        
        //const res = JSON.parse(await response.text());

        const res = await response.json();
        //console.log(res);
        return res;

        // console.log(res); print out api response too see the data
    } catch (e) {
        console.log(e.toString());
        return;
    }
}
export default postJSON;