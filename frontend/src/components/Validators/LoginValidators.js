
function matchingPasswords(password, repeat, setPasswordError, setRepeatError) {
    if(password != repeat){
        setPasswordError("is-invalid");
        setRepeatError("is-invalid");
        return false;
    }
    setPasswordError("");
    setRepeatError("");
    return true;
}

function isBlank(fields, setErrors){
    let ret = false;
    for(let i = 0; i < fields.length; i++){
        console.log(fields[i].length);
        if(fields[i].length == 0){
            setErrors[i]("is-invalid");
            ret = true;
        }else{
            setErrors[i]("");
        }
    }
    return ret;
}

export {matchingPasswords, isBlank};