class SignupButton extends React.Component{
    render(){
        return <button onClick={() => signup()}>Login</button>
    }
}

class SignupError extends React.Component{

}

function signup(){
    //Get fields
    //No validity checkers yet, add later
    //Call signup api
    //If valid, change html file
    //Else make error message with error class
}

ReactDOM.render("<SignupButton />", document.getElementById('root'));