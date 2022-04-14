import {render, screen} from "@testing-library/react";
import ResetPassword from "../ResetPassword";

test("ResetPassword component render without crashing", () =>{
    render(<ResetPassword />);
    const resetPassElement = screen.getByTestId("resetPassword-container");
    expect(resetPassElement).toBeInTheDocument();
})