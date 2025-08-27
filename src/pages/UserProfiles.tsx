import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchProfile } from "../store/slices/Profile";
import { RootState } from "../store";

interface ProfileData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string | null;
}

export default function UserProfiles() {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector(
    (state: RootState) => state.profile
  );

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile({ token }) as any);
    }
  }, [dispatch, token]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getDisplayName = (profile: ProfileData) => {
    const firstName = profile.first_name?.trim();
    const lastName = profile.last_name?.trim();
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    }
    return profile.username;
  };

  const getInitials = (profile: ProfileData) => {
    const firstName = profile.first_name?.trim();
    const lastName = profile.last_name?.trim();
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    } else if (lastName) {
      return lastName.slice(0, 2).toUpperCase();
    }
    return profile.username.slice(0, 2).toUpperCase();
  };

  const getRoleInfo = (profile: ProfileData) => {
    if (profile.is_superuser) {
      return {
        name: "Super Administrator",
        description: "Full system access with all permissions",
        level: "Executive"
      };
    } else if (profile.is_staff) {
      return {
        name: "Staff Member",
        description: "Administrative access to manage system",
        level: "Management"
      };
    }
    return {
      name: "Standard User",
      description: "Regular user access with standard permissions",
      level: "User"
    };
  };

  const getAccountAge = (dateString: string) => {
    const joinDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  };

  const getLastLoginStatus = (lastLogin: string | null) => {
    if (!lastLogin) return { text: "Never", status: "inactive" };
    
    const loginDate = new Date(lastLogin);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return { text: "Active now", status: "active" };
    if (diffHours < 24) return { text: `${diffHours}h ago`, status: "recent" };
    if (diffHours < 168) return { text: `${Math.floor(diffHours / 24)}d ago`, status: "recent" };
    return { text: "Inactive", status: "inactive" };
  };

  if (loading) {
    return (
      <>
        <PageMeta
          title="Profile | TailAdmin Dashboard"
          description="User profile details page"
        />
        <PageBreadcrumb pageTitle="Profile" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Loading Profile</h3>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your information...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageMeta
          title="Profile | TailAdmin Dashboard"
          description="User profile details page"
        />
        <PageBreadcrumb pageTitle="Profile" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Unable to Load Profile</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <PageMeta
          title="Profile | TailAdmin Dashboard"
          description="User profile details page"
        />
        <PageBreadcrumb pageTitle="Profile" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">No Profile Found</h3>
              <p className="text-gray-600 dark:text-gray-400">Please ensure you're logged in and have the necessary permissions.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const displayName = getDisplayName(profile);
  const roleInfo = getRoleInfo(profile);
  const accountAge = getAccountAge(profile.date_joined);
  const loginStatus = getLastLoginStatus(profile.last_login);

  return (
    <>
      <PageMeta
        title={`${displayName} - Profile | TailAdmin Dashboard`}
        description="User profile details page"
      />
      <PageBreadcrumb pageTitle="Profile" />

      <div className="max-w-6xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-8">
          <div className="relative h-32 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>
          <div className="relative px-8 pb-8 -mt-16">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-4 border-white dark:border-gray-900 flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl font-bold">{getInitials(profile)}</span>
                    </div>
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white dark:border-gray-900 ${
                    loginStatus.status === 'active' ? 'bg-green-500' :
                    loginStatus.status === 'recent' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="lg:mb-6">
                  <h1 className="text-3xl font-bold text-black dark:text-white mb-1">{displayName}</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">@{profile.username} • ID: {profile.id}</p>
                  <div className="flex items-center space-x-3">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      {roleInfo.name}
                    </span>
                    <span className={`text-sm font-medium ${
                      loginStatus.status === 'active' ? 'text-green-600' :
                      loginStatus.status === 'recent' ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {loginStatus.text}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-6 mt-4 lg:mt-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">#{profile.id}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">User ID</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black dark:text-white">{accountAge}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Member</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Column - Profile Info */}
          <div className="xl:w-1/3 space-y-6">
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-black dark:text-white">Contact Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Email Address</label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <span className="text-black dark:text-white font-medium">{profile.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Username</label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <span className="text-black dark:text-white font-mono">{profile.username}</span>
                  </div>
                </div>
                {(profile.first_name || profile.last_name) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Full Name</label>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <span className="text-black dark:text-white">
                        {`${profile.first_name} ${profile.last_name}`.trim() || 'Not provided'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Role & Permissions */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-black dark:text-white">Role & Access</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">{roleInfo.name}</h3>
                    <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {roleInfo.level}
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{roleInfo.description}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${profile.is_staff ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium text-black dark:text-white">Staff Access</span>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      profile.is_staff 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {profile.is_staff ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${profile.is_superuser ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium text-black dark:text-white">Superuser</span>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      profile.is_superuser 
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {profile.is_superuser ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Timeline */}
          <div className="xl:w-2/3">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 h-full">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-black dark:text-white">Account Activity</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Track your account history and timeline</p>
                </div>
              </div>

              {/* Account Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="text-3xl font-bold text-blue-600 mb-2">#{profile.id}</div>
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-300">User Identifier</div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <div className="text-3xl font-bold text-green-600 mb-2">{accountAge}</div>
                  <div className="text-sm font-medium text-green-700 dark:text-green-300">Account Age</div>
                </div>
                
                <div className={`bg-gradient-to-r rounded-xl p-6 border ${
                  loginStatus.status === 'active' 
                    ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800'
                    : loginStatus.status === 'recent'
                    ? 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800'
                    : 'from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 border-gray-200 dark:border-gray-700'
                }`}>
                  <div className={`text-3xl font-bold mb-2 ${
                    loginStatus.status === 'active' ? 'text-green-600' :
                    loginStatus.status === 'recent' ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {loginStatus.text}
                  </div>
                  <div className={`text-sm font-medium ${
                    loginStatus.status === 'active' ? 'text-green-700 dark:text-green-300' :
                    loginStatus.status === 'recent' ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Last Activity
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Account Timeline</h3>
                
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
                  
                  {profile.last_login && (
                    <div className="relative flex items-start space-x-4 pb-8">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center border-4 border-white dark:border-gray-900">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold text-black dark:text-white mb-1">Last Login Activity</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{formatDate(profile.last_login)}</p>
                        <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full font-medium ${
                          loginStatus.status === 'active' 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : loginStatus.status === 'recent'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {loginStatus.text}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="relative flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center border-4 border-white dark:border-gray-900">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-black dark:text-white mb-1">Account Created</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{formatDate(profile.date_joined)}</p>
                      <span className="inline-flex items-center text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full font-medium">
                        Member for {accountAge}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}