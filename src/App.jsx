import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import RootPage from "./pages/RootPage";
import HomePage from "./pages/HomePage";
import CategoryListPage from "./pages/CategoryListPage";
import ContentDetailPage from "./pages/ContentDetailPage";
import ErrorPage from "./pages/ErrorPage";
import ValidContentType from "./components/ValidContentType";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootPage />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <HomePage /> },
        {
          path: "/:contentType/detail/:contentId",
          element: (
            <ValidContentType>
              <ContentDetailPage />
            </ValidContentType>
          ),
        },
        {
          path: "/:contentType/:category",
          element: (
            <ValidContentType>
              <CategoryListPage />
            </ValidContentType>
          ),
        },
        { path: "/favorites", element: <div>Favorites</div> },
      ],
    },
    { path: "*", element: <ErrorPage message="Page does not exist" /> },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
