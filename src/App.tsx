import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import { lazy, Suspense, useState } from "react";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Edit } from "lucide-react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./store/slices/authslice";
import ArticleList from "./pages/Content/ArticleList";

import UserList from "./pages/user/user-list";
import UserEditForm from "./pages/user/userEditForm";
import UserAnalytics from "./pages/Anayltics/userAnayltics";
import EditArticle from "./pages/Content/EditArticle";
import AddArticle from "./pages/Content/AddArticle";
import EditRashi from "./pages/Content/Rashi/EditRashi";
import AddPlanet from "./pages/Content/Planet/AddPlanet";
import PlanetList from "./pages/Content/Planet/PlanetList";
import EditPlanet from "./pages/Content/Planet/EditPlanet";

// Lazy load pages
const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));

const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const Videos = lazy(() => import("./pages/UiElements/Videos"));
const Images = lazy(() => import("./pages/UiElements/Images"));
const Alerts = lazy(() => import("./pages/UiElements/Alerts"));
const Badges = lazy(() => import("./pages/UiElements/Badges"));
const Avatars = lazy(() => import("./pages/UiElements/Avatars"));
const Buttons = lazy(() => import("./pages/UiElements/Buttons"));
const LineChart = lazy(() => import("./pages/Charts/LineChart"));
const BarChart = lazy(() => import("./pages/Charts/BarChart"));
const BasicTables = lazy(() => import("./pages/Tables/BasicTables"));
const FormElements = lazy(() => import("./pages/Forms/FormElements"));

const AppLayout = lazy(() => import("./layout/AppLayout"));
const Home = lazy(() => import("./pages/Dashboard/Home"));

const AddRashi = lazy(() => import("./pages/Content/Rashi/AddRashi"));
const RashiList = lazy(() => import("./pages/Content/Rashi/RashiList"));

// Simple modal wrapper for SignIn
function SignInModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 32,
          minWidth: 350,
          boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <SignIn />
        </Suspense>
      </div>
    </div>
  );
}

export default function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [showSignIn, setShowSignIn] = useState(false);

  // Show popup if not authenticated and not on /signin or /signup
  // (You may want to refine this logic based on your routing needs)
  React.useEffect(() => {
    if (!isAuthenticated) {
      setShowSignIn(true);
    } else {
      setShowSignIn(false);
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
        <Routes>
          {/* Public Routes - Only accessible when NOT authenticated */}
          <Route
            path="/signin"
            element={
              !isAuthenticated ? <SignIn /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/signin"
            element={
              !isAuthenticated ? <SignIn /> : <Navigate to="/" replace />
            }
          />

          {/* Protected Routes - Only accessible when authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              {/* Filters */}

              {/* Files */}

              {/* Students */}
              {/* Users */}
              <Route path="/users/all" element={<UserList />} />
              <Route path="/users/:userId" element={<UserEditForm />} />

              <Route path="/analytics/user" element={<UserAnalytics />} />

              {/* Content Management */}

              <Route path="/content/add" element={<AddArticle></AddArticle>} />
              <Route path="/content/all" element={<ArticleList />} />
              <Route path="/articles/edit" element={<EditArticle />} />

              <Route path="/kundli/rashi/add" element={<AddRashi></AddRashi>} />
              <Route path="/kundli/rashi/list" element={<RashiList />} />
              <Route path="/kundli/rashi/edit" element={<EditRashi />} />
              <Route
                path="/kundli/planet/add"
                element={<AddPlanet />}
              />
              <Route
                path="/kundli/planet/list"
                element={<PlanetList />}
              />
              <Route
                path="/kundli/planet/edit"
                element={<EditPlanet />}
              />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* UI Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>

          {/* Redirect unauthenticated users to signup instead of signin */}
          <Route
            path="*"
            element={
              !isAuthenticated ? (
                <Navigate to="/signup" replace />
              ) : (
                <NotFound />
              )
            }
          />
        </Routes>
        {/* SignIn Popup */}
        <SignInModal
          open={
            showSignIn &&
            window.location.pathname !== "/signin" &&
            window.location.pathname !== "/signup"
          }
          onClose={() => setShowSignIn(false)}
        />
      </Suspense>
    </Router>
  );
}
