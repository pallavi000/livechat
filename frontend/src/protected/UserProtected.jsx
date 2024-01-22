import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function UserProtected(props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
    } else {
      navigate("/login");
    }
  }, [props]);

  return <Outlet />;
}

export default UserProtected;
