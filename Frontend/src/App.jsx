import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { useAuth } from './hooks/useAuth';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import NovelDetailsPage from './pages/NovelDetailsPage';
import ChapterPage from './pages/ChapterPage';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AuthorPage from './pages/AuthorPage';
import AuthorDashboardPage from './pages/AuthorDashboardPage';
import CreateNovelPage from './pages/CreateNovelPage';
import EditNovelPage from './pages/EditNovelPage';
import CreateChapterPage from './pages/CreateChapterPage';
import EditChapterPage from './pages/EditChapterPage';
import ManageChaptersPage from './pages/ManageChaptersPage';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import GuidelinesPage from './pages/GuidelinesPage';
import ContactPage from './pages/ContactPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/novels/:id" element={<NovelDetailsPage />} />
            <Route path="/authors/:id" element={<AuthorPage />} />
            <Route path="/novels/:novelId/chapters/:chapterNumber" element={<ChapterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/library" 
              element={
                <ProtectedRoute>
                  <LibraryPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AuthorDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/novels/create" 
              element={
                <ProtectedRoute>
                  <CreateNovelPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/novels/:id/edit" 
              element={
                <ProtectedRoute>
                  <EditNovelPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/novels/:novelId/chapters/create" 
              element={
                <ProtectedRoute>
                  <CreateChapterPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/novels/:novelId/chapters/:chapterNumber/edit" 
              element={
                <ProtectedRoute>
                  <EditChapterPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/novels/:id/manage-chapters" 
              element={
                <ProtectedRoute>
                  <ManageChaptersPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Additional Pages */}
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/guidelines" element={<GuidelinesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;