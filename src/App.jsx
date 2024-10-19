import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import RootPage from "./pages/RootPage";
import HomePage from "./pages/HomePage";
import CategoryListPage from "./pages/CategoryListPage";
import ContentDetailPage from "./pages/ContentDetailPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootPage />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/:contentType/:category", element: <CategoryListPage /> },
        {
          path: "/:contentType/detail/:contentId",
          element: <ContentDetailPage />,
        },
        { path: "/wishlist", element: <div></div> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
