import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import RootPage from "./pages/RootPage";
import HomePage from "./pages/HomePage";
import CategoryListPage from "./pages/CategoryListPage";
import ContentDetailPage from "./pages/ContentDetailPage";
import ErrorPage from "./pages/ErrorPage";
import ValidContentType from "./components/ValidContentType";
import { UserAuthContextProvider } from "./store/UserAuthContextProvider";
import AuthenticationPage from "./pages/AuthenticationPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./pages/ProtectedRoute";
import RedirectIfAuthenticatedPage from "./pages/RedirectIfAuthenticatedPage";

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
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: (
        <RedirectIfAuthenticatedPage>
          <AuthenticationPage type="login" />
        </RedirectIfAuthenticatedPage>
      ),
    },
    {
      path: "/signup",
      element: (
        <RedirectIfAuthenticatedPage>
          <AuthenticationPage type="signup" />
        </RedirectIfAuthenticatedPage>
      ),
    },
    { path: "*", element: <ErrorPage message="Page does not exist" /> },
  ]);

  return (
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  );
}

export default App;
