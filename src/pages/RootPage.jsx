import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

const RootPage = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default RootPage;