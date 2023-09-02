/* eslint-disable react/prop-types */
import React from "react";

export default function NewLogoDisplay({ newLogo }) {
  {
    if (newLogo) {
      return (
        <div className="absolute top-[28%] right-[11%] lg:top-[4%] lg:right-[26%] md:top-[3%] z-30">
          <img src="/new-1-svgrepo-com.svg" className="w-[50px] animate-bounce" />
        </div>
      );
    }
  }
}
