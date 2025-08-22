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
import AddVastuEntrance from "./pages/Content/vastu/entranceAnalysis/AddEntrance";
import EntranceAnalysisList from "./pages/Content/vastu/entranceAnalysis/EntranceList";
import EntranceList from "./pages/Content/vastu/entrance/EntranceList";
import EditVastuEntrance from "./pages/Content/vastu/entranceAnalysis/EditEntrance";
import AddPersonality from "./pages/Content/numerology/personality/AddPersonality";
import PersonalityList from "./pages/Content/numerology/personality/PersonalityList";
import EditPersonality from "./pages/Content/numerology/personality/EditPersonality";
import AddYearPrediction from "./pages/Content/numerology/yearPredictions/AddYearPredictions";
import YearPredictionsList from "./pages/Content/numerology/yearPredictions/YearPredictionsList";
import EditYearPrediction from "./pages/Content/numerology/yearPredictions/EditYearPredictions";
import AddPlanet from "./pages/Content/Planet/AddPlanet";
import AddMissingNumber from "./pages/Content/numerology/missingNumberRemedies/AddNumber";
import MissingNumberList from "./pages/Content/numerology/missingNumberRemedies/NumberList";
import EditMissingNumber from "./pages/Content/numerology/missingNumberRemedies/EditNumber";
import AddRajyog from "./pages/Content/numerology/rajyog/AddRajyog";
import RajyogsList from "./pages/Content/numerology/rajyog/RajyogList";
import EditRajyog from "./pages/Content/numerology/rajyog/EditRajyog";
import EditPlanet from "./pages/Content/Planet/EditPlanet";
import PlanetList from "./pages/Content/Planet/PlanetList";
import AddTag from "./pages/Content/Tag/AddTag";
import TagList from "./pages/Content/Tag/TagList";
import NumbersList from "./pages/Content/numerology/numbers/NumbersList";
import EditNumbers from "./pages/Content/numerology/numbers/EditNumbers";
import QuestionList from "./pages/Question/QuestionList";
import AddQustion from "./pages/Question/AddQustion";
import ZoneList from "./pages/Zone/ZoneList";
import ZoneDetails from "./pages/Zone/ZoneDetails";
import YogsList from "./pages/Yog/YogsList";
import YogsDetails from "./pages/Yog/YogDetails";
import PersonalYears from "./pages/PersonalYears/PersonalYears";
import Analytics from "./pages/Analytics/Analytics";
import AnalyticsDetails from "./pages/Analytics/AnalyticsDetails";
import Houses from "./pages/Houses/Houses";
import EditYog from "./pages/Yog/EditYog";
import EditEntrance from "./pages/Content/vastu/entrance/EditEntrance";
import HousesDetails from "./pages/Houses/HousesDetails";
import PersonalDetails from "./pages/PersonalYears/PersonalDetails";

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

              {/* zone */}
              <Route path="/zone/list" element={<ZoneList />} />
              <Route path="/zone/:zoneId" element={<ZoneDetails />} />

              {/* Kundli */}

              {/* Content Management */}

              <Route path="/content/add" element={<AddArticle></AddArticle>} />
              <Route path="/content/all" element={<ArticleList />} />
              <Route path="/articles/edit" element={<EditArticle />} />
              <Route path="/content/tags/add" element={<AddTag />} />
              <Route path="/content/tags/list" element={<TagList />} />

              <Route path="/kundli/rashi/add" element={<AddRashi></AddRashi>} />
              <Route path="/kundli/rashi/list" element={<RashiList />} />
              <Route path="/kundli/rashi/edit" element={<EditRashi />} />
              <Route path="/kundli/planet/add" element={<AddPlanet />} />

              <Route path="/kundli/planet/list" element={<PlanetList />} />
              <Route path="/kundli/planet/edit" element={<EditPlanet />} />
              <Route
                path="/kundli/planet/list"
                element={<div>Planet List</div>}
              />

              {/* Questions */}
              <Route path="/questions" element={<QuestionList />} />
              <Route path="/questions/add" element={<AddQustion />} />
              <Route
                path="/vastu/entrance/analysis/add"
                element={<AddVastuEntrance />}
              />
              <Route
                path="/vastu/entrance/analysis/list"
                element={<EntranceAnalysisList />}
              />
              <Route
                path="/vastu/entrance/analysis/edit"
                element={<EditVastuEntrance />}
              />

              <Route path="/vastu/entrance/list" element={<EntranceList />} />
              <Route path="/vastu/entrance/edit" element={<EditEntrance />} />
              <Route
                path="/numerology/personality/add"
                element={<AddPersonality />}
              />
              <Route
                path="/numerology/personality/list"
                element={<PersonalityList />}
              />
              <Route
                path="/numerology/personality/edit"
                element={<EditPersonality />}
              />
              <Route
                path="/numerology/year-prediction/add"
                element={<AddYearPrediction />}
              />
              <Route
                path="/numerology/year-prediction/list"
                element={<YearPredictionsList />}
              />
              <Route
                path="/numerology/year-prediction/edit"
                element={<EditYearPrediction />}
              />
              <Route
                path="/numerology/missing-number-remedies/add"
                element={<AddMissingNumber />}
              />
              <Route
                path="/numerology/missing-number-remedies/list"
                element={<MissingNumberList />}
              />
              <Route
                path="/numerology/missing-number-remedies/edit"
                element={<EditMissingNumber />}
              />
              <Route
                path="/numerology/numbers/list"
                element={<NumbersList />}
              />

              <Route path="/yogs/list" element={<YogsList />} />
              <Route path="/yog/edit" element={<EditYog />} />
              <Route path="/personal-years/list" element={<PersonalYears />} />
              <Route
                path="/personal-years/details"
                element={<PersonalDetails />}
              />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/analytics/details" element={<AnalyticsDetails />} />
              {/* Houses */}
              <Route path="/houses" element={<Houses />} />
              <Route path="/houses/details" element={<HousesDetails />} />

              <Route
                path="/numerology/numbers/edit"
                element={<EditNumbers />}
              />
              <Route path="/numerology/rajyogs/add" element={<AddRajyog />} />
              <Route
                path="/numerology/rajyogs/list"
                element={<RajyogsList />}
              />
              <Route path="/numerology/rajyogs/edit" element={<EditRajyog />} />
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
