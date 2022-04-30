import logo from "./logo.svg";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserPage from "./pages/UserPage";
import EmailVerifyPage from "./pages/EmailVerifyPage";
import InvalidPage from "./pages/InvalidPage";
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <LoginPage />
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
        <Route path="*">
          <InvalidPage/>
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
