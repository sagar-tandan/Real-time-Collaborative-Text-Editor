import React, { useContext } from "react";
import MyContext from "../../../Context/MyContext";

const Toolbar = () => {
  const { editor } = useContext(MyContext);

  console.log("Toolbar Editor : ", editor);
  return <div>Toolbar</div>;
};

export default Toolbar;
