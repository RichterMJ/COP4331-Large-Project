import {render, screen} from "@testing-library/react";
import Login from "../Login";

test("Login component render without crashing", () =>{
    render(<Login/>);
    const loginElement = screen.getByTestId("login-container");
    expect(loginElement).toBeInTheDocument();
})