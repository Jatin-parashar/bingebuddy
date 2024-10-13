import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import RootPage from "./pages/RootPage";
import HomePage from "./pages/HomePage";
import CategoryListPage from "./pages/CategoryListPage";
import ContentDetailPage from "./pages/ContentDetailPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootPage />,
      errorElement: <h2>Error Occurred</h2>,
      children: [
        { path: "/", element: <HomePage /> }, // Overview of all types of content
        { path: "/:contentType/:category", element: <CategoryListPage /> }, // Listings for movies, TV, etc.
        { path: "/:contentType/detail/:contentId", element: <ContentDetailPage /> }, // Detail for a specific item
      ]
    }
  ]);
  return <RouterProvider router={router} />;
}

export default App;
