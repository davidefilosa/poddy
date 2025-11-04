import React from "react";

const SignInLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full h-screen lg:w-1/2 flex items-center justify-center bg-linear-to-br from-blue-500 lg:from-white lg:to-white to-purple-500">
        {children}
      </div>
      <div className="w-1/2 h-screen hidden lg:flex bg-linear-to-br from-blue-500 to-purple-500"></div>
    </div>
  );
};

export default SignInLayout;
