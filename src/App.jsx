import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import ErrorPage from "./pages/ErrorPage";
import ValidContentType from "./components/ValidContentType";
import { UserAuthContextProvider } from "./store/UserAuthContextProvider";
import SuspenseLoadingPage from "./pages/SuspenseLoadingPage";

// Lazy load the components
const RootPage = lazy(() => import("./pages/RootPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const CategoryListPage = lazy(() => import("./pages/CategoryListPage"));
const ContentDetailPage = lazy(() => import("./pages/ContentDetailPage"));
const AuthenticationPage = lazy(() => import("./pages/AuthenticationPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ProtectedRoute = lazy(() => import("./pages/ProtectedRoute"));
const RedirectIfAuthenticatedPage = lazy(() => import("./pages/RedirectIfAuthenticatedPage"));

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<SuspenseLoadingPage />}>
          <RootPage />
        </Suspense>
      ),
      errorElement: (
        <Suspense fallback={<SuspenseLoadingPage />}>
          <ErrorPage />
        </Suspense>
      ),
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<SuspenseLoadingPage />}>
              <HomePage />
            </Suspense>
          ),
        },
        {
          path: "/:contentType/detail/:contentId",
          element: (
            <Suspense fallback={<SuspenseLoadingPage />}>
              <ValidContentType>
                <ContentDetailPage />
              </ValidContentType>
            </Suspense>
          ),
        },
        {
          path: "/:contentType/:category",
          element: (
            <Suspense fallback={<SuspenseLoadingPage />}>
              <ValidContentType>
                <CategoryListPage />
              </ValidContentType>
            </Suspense>
          ),
        },
        {
          path: "/profile",
          element: (
            <Suspense fallback={<SuspenseLoadingPage />}>
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: (
        <Suspense fallback={<SuspenseLoadingPage />}>
          <RedirectIfAuthenticatedPage>
            <AuthenticationPage type="login" />
          </RedirectIfAuthenticatedPage>
        </Suspense>
      ),
    },
    {
      path: "/signup",
      element: (
        <Suspense fallback={<SuspenseLoadingPage />}>
          <RedirectIfAuthenticatedPage>
            <AuthenticationPage type="signup" />
          </RedirectIfAuthenticatedPage>
        </Suspense>
      ),
    },
    {
      path: "*",
      element: (
        <Suspense fallback={<SuspenseLoadingPage />}>
          <ErrorPage message="Page does not exist" />
        </Suspense>
      ),
    },
  ]);

  return (
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  );
}

export default App;
