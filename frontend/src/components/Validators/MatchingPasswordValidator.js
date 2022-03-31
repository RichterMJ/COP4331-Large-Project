
function matchingPasswords(password, repeat) {
    if(password != repeat){
        password.classList.add("is-invalid");
        repeat.classList.add("isInvalid");
        return false;
    }
    return true;
}
export default matchingPasswords;