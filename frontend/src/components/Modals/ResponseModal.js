import React from "react";
//import { RiCloseLine } from "react-icons/ri";

const ResoponseModal = ({ setIsOpen, responseMessage }) => {
  return (
    <>
      <div className="darkBG" />
      <div className="centered">
        <div className="responseModal">
          <div className="modalContent">
            {responseMessage}!
          </div>
            <div className="modalActions">
              <div className="actionsContainer">
                <button
                  className="okayBtn"
                  onClick={() => (window.location.href = "/")}
                >
                  Okay
                </button>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};
export default ResoponseModal;
