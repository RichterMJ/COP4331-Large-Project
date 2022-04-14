import {render, screen} from "@testing-library/react";
import ForgotPassword from "../ForgotPassword";

test("ForgotPassword component render without crashing", () =>{
    render(<ForgotPassword/>);
    const forgotPassElement = screen.getByTestId("forgotPassword-container");
    expect(forgotPassElement).toBeInTheDocument();
})