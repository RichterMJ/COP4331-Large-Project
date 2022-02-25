

class LoginButton extends React.Component{
    render(){
        return <button onClick={() => login()}>Login</button>
    }
}

class LoginError extends React.Component{

}

function login(){
    //Get fields
    //Call login api
    //If valid, change html file
    //Else make error message with error class
}

ReactDOM.render("<LoginButton />", document.getElementById('root'));