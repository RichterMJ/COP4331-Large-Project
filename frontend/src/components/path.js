// FIXME, change to herku with better name
const app_name = 'git-fit-cop4331'

function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
        return 'https://' + app_name + '.herokuapp.com/' + route;
    }
    else {
        // that port should be based of an env var, FIXME
        return 'http://localhost:8080/' + route;
    }
}

export default buildPath;