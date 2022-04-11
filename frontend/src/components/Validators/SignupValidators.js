

function isBlank(fields, formClassErrors, setFormClassErrors, formError, setFormError){
    let ret = false;

    for(let i = 0; i < fields.length; i++){
        if(fields[i].length == 0){
            ret = true;
            setBlankError(i, formError, formClassErrors, true);
        }else{
            setBlankError(i, formError, formClassErrors, false);
        }
    }

    setFormClassErrors(formClassErrors);
    setFormError(formError);
    return ret;
}

function validWeight(weight, formClassErrors, setFormClassErrors, formError, setFormError)
{
    let ret = true;

    const regrex = /^[0-9]*\.?[0-9]+$/;

    if(!regrex.test(weight)){
        formClassErrors.weightErrorClass = "is-invalid";
        formError.weightError = "Not a valid weight";
        ret = false;
    }

    setFormClassErrors(formClassErrors);
    setFormError(formError);
    return ret;
}

function validEmail(email, formClassErrors, setFormClassErrors, formError, setFormError)
{
    let ret = true;

    const regrex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!regrex.test(email)){
        formClassErrors.emailErrorClass = "is-invalid";
        formError.emailError = "email is need to be in format of xxx@xxx.xxx";
        ret = false;
    }

    setFormClassErrors(formClassErrors);
    setFormError(formError);
    return ret;
}

function validPassword(password, formClassErrors, setFormClassErrors, formError, setFormError)
{
    let ret = true;
    
    const regrex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!regrex.test(password)){
        formClassErrors.pwErrorClass = "is-invalid";
        formError.pwError = "password must contains at least 8 character, one letter and one number";
        ret = false;
    }
  
    setFormClassErrors(formClassErrors);
    setFormError(formError);
    return ret;
}

function matchingPasswords(password, repeat, formClassErrors, setFormClassErrors, formError, setFormError) {
    let ret = true;

    if(password != repeat){
        formClassErrors.pwErrorClass = "is-invalid";
        formClassErrors.repeatErrorClass = "is-invalid";
        formError.repeatError = "passwords do not match";
        ret = false;
    }

    setFormClassErrors(formClassErrors);
    setFormError(formError);
    return ret;
}

function setBlankError(i, textErrors, classErrors, flag){
    switch(i){
        case 0:
            textErrors.fnError = (flag) ? "first name is required" : "";
            classErrors.fnErrorClass = (flag) ? "is-invalid" : "";
            break;
        case 1:
            textErrors.lnError = (flag) ? "last name is required" : "";
            classErrors.lnErrorClass = (flag) ? "is-invalid" : "";
            break;
        case 2:
            textErrors.weightError = (flag) ? "weight is requried" : "";
            classErrors.weightErrorClass = (flag) ? "is-invalid" : "";
            break;
        case 3:
            textErrors.emailError = (flag) ? "email is required" : "";
            classErrors.emailErrorClass = (flag) ? "is-invalid" : "";
            break;
        case 4:
            textErrors.pwError = (flag) ? "password is required" : "";
            classErrors.pwErrorClass = (flag) ? "is-invalid" : "";
            break;
        case 5:
            textErrors.repeatError = (flag) ? "repeat is required" : "";
            classErrors.repeatErrorClass = (flag) ? "is-invalid" : "";
            break;
    }
}

export {isBlank, validWeight, validEmail, validPassword, matchingPasswords};