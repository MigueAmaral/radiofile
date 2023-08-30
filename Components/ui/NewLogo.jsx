/* eslint-disable react/prop-types */
import React from "react";

export default function NewLogoDisplay({ newLogo }) {
  {
    if (newLogo) {
      return (
        <div className="absolute top-[4%] right-[26%]">
          <img src="/new-1-svgrepo-com.svg" className="w-[50px] animate-bounce" />
        </div>
      );
    }
  }
}
