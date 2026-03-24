import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import DashboardPage from "@/pages/DashboardPage";
import CreateVideoPage from "@/pages/CreateVideoPage";
import MyVideosPage from "@/pages/MyVideosPage";
import ExtendVideoPage from "@/pages/ExtendVideoPage";
import BillingPage from "@/pages/BillingPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import CreateLandingPage from "@/pages/CreateLandingPage";
import MyLandingPagesPage from "@/pages/MyLandingPagesPage";
import PreviewLandingPage from "@/pages/PreviewLandingPage";
import LandingPageProgressPage from "@/pages/LandingPageProgressPage";
import VideoProgressPage from "@/pages/VideoProgressPage";
import ExtendVideoProgressPage from "@/pages/ExtendVideoProgressPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import RefundPolicyPage from "@/pages/RefundPolicyPage";
import CookiePolicyPage from "@/pages/CookiePolicyPage";
import SubtitlesPage from "@/pages/SubtitlesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <AuthProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/refund" element={<RefundPolicyPage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/create" element={<CreateVideoPage />} />
              <Route path="/videos" element={<MyVideosPage />} />
              <Route path="/extend/:id" element={<ExtendVideoPage />} />
              <Route path="/create-landing-page" element={<CreateLandingPage />} />
              <Route path="/landing-pages" element={<MyLandingPagesPage />} />
              <Route path="/preview-landing/:id" element={<PreviewLandingPage />} />
              <Route path="/landing-progress/:id" element={<LandingPageProgressPage />} />
              <Route path="/video-progress/:id" element={<VideoProgressPage />} />
              <Route path="/extend-progress/:id" element={<ExtendVideoProgressPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
