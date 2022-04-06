import logo from "./logo.svg";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserPage from "./pages/UserPage";
import EmailVerifyPage from "./pages/EmailVerifyPage";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import ResetPasswordPage from "./pages/ResetPasswordPage";
function User(){
  let firstName = "";
  let lastName = "";
  let userID = "";
  let token;
  return {firstName, lastName, userID, token};
}
function App() {
  let user = new User();
  user.firstName = "YHWH";
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <LoginPage user={user} />
        </Route>
        <Route path="/signup" exact>
          <SignupPage />
        </Route>
        <Route path="/forgotPassword" exact>
          <ForgotPasswordPage />
        </Route>
        <Route path="/resetPassword" exact>
          <ResetPasswordPage />
        </Route>
        <Route path="/userPage" exact>
          <UserPage />
        </Route>
        <Route path="/emailVerify" exact>
          <EmailVerifyPage />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
