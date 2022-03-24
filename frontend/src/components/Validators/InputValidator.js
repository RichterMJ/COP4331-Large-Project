import React from 'react';

// funtion return 1 if input is blank
  // return 0 if not blank
  function blankValidator(...fields) {
    let isBlanked = false;
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].value == "") {
        fields[i].classList.add("is-invalid");
        isBlanked = true;
      } else {
        fields[i].classList.remove("is-invalid");
      }
    }

    return isBlanked;
  }

  export {blankValidator};
