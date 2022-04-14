import React from "react";

const VerifyModal = () => {
  return (
    <>
      <div className="darkBG"/>
      <div className="centered">
        <div className="theModal">
          <div className="modalContent">
            Check your Email Address for Account Verification!
          </div>
          <div className="modalActions">
            <div className="actionsContainer">
              <button className="okayBtn" onClick={() => window.location.href = "/"}>
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default VerifyModal;