import {render, screen} from "@testing-library/react";
import ForgotPassword from "../ForgotPassword";

test("ForgotPassword component render without crashing", () =>{
    render(<ForgotPassword/>);
    const loginElement = screen.getByTestId("forgotPassword-container");
    expect(loginElement).toBeInTheDocument();
})