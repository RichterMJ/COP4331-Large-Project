import React from 'react';

// funtion return 1 if input is blank
  // return 0 if not blank
  function blankValidator(...fields) {
    let isBlanked = false;
    for (let i = 0; i < fields.length; i++) {
      let element = document.getElementById(fields[i].value);
      if (fields[i].value == "") {
        element.classList.add("is-invalid");
        isBlanked = true;
      } else {
        element.classList.remove("is-invalid");
      }
    }

    return isBlanked;
  }

  export {blankValidator};
