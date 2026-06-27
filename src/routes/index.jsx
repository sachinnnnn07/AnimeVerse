import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorFallback from '@/components/ui/ErrorFallback';
import RequireAuth from '@/components/auth/RequireAuth';

const HomePage = lazy(() => import('@/pages/HomePage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const BrowsePage = lazy(() => import('@/pages/BrowsePage'));
const AnimeDetailPage = lazy(() => import('@/pages/AnimeDetailPage'));
const CharacterDetailPage = lazy(() => import('@/pages/CharacterDetailPage'));
const SeasonalPage = lazy(() => import('@/pages/SeasonalPage'));
const TopRankingsPage = lazy(() => import('@/pages/TopRankingsPage'));
const WatchlistPage = lazy(() => import('@/pages/WatchlistPage'));
const RecommendationsPage = lazy(() => import('@/pages/RecommendationsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const RandomPickerPage = lazy(() => import('@/pages/RandomPickerPage'));
const SchedulePage = lazy(() => import('@/pages/SchedulePage'));
const ComparePage = lazy(() => import('@/pages/ComparePage'));
const QuizPage = lazy(() => import('@/pages/QuizPage'));
const RecentlyViewedPage = lazy(() => import('@/pages/RecentlyViewedPage'));
const MoodPickerPage = lazy(() => import('@/pages/MoodPickerPage'));
const StudioSpotlightPage = lazy(() => import('@/pages/StudioSpotlightPage'));
const TrailerTheaterPage = lazy(() => import('@/pages/TrailerTheaterPage'));
const TierListPage = lazy(() => import('@/pages/TierListPage'));
const ThisOrThatPage = lazy(() => import('@/pages/ThisOrThatPage'));
const WatchOrderPage = lazy(() => import('@/pages/WatchOrderPage'));
const VoiceActorPage = lazy(() => import('@/pages/VoiceActorPage'));
const AnimeOfTheDayPage = lazy(() => import('@/pages/AnimeOfTheDayPage'));
const CountdownPage = lazy(() => import('@/pages/CountdownPage'));
const CustomListsPage = lazy(() => import('@/pages/CustomListsPage'));
const ExportPage = lazy(() => import('@/pages/ExportPage'));
const AnimeMapPage = lazy(() => import('@/pages/AnimeMapPage'));
const YearInReviewPage = lazy(() => import('@/pages/YearInReviewPage'));
const AchievementsPage = lazy(() => import('@/pages/AchievementsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function PageLoader({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

function Protected({ children, feature }) {
  return (
    <RequireAuth feature={feature}>
      {children}
    </RequireAuth>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorFallback message="Something went wrong" />,
    children: [
      // Public — no login needed
      { index: true, element: <PageLoader><HomePage /></PageLoader> },
      { path: 'search', element: <PageLoader><SearchPage /></PageLoader> },
      { path: 'browse', element: <PageLoader><BrowsePage /></PageLoader> },
      { path: 'anime/:id', element: <PageLoader><AnimeDetailPage /></PageLoader> },
      { path: 'character/:id', element: <PageLoader><CharacterDetailPage /></PageLoader> },
      { path: 'seasonal', element: <PageLoader><SeasonalPage /></PageLoader> },
      { path: 'top', element: <PageLoader><TopRankingsPage /></PageLoader> },
      { path: 'schedule', element: <PageLoader><SchedulePage /></PageLoader> },
      { path: 'mood', element: <PageLoader><MoodPickerPage /></PageLoader> },
      { path: 'studios', element: <PageLoader><StudioSpotlightPage /></PageLoader> },
      { path: 'trailers', element: <PageLoader><TrailerTheaterPage /></PageLoader> },
      { path: 'voiceactors', element: <PageLoader><VoiceActorPage /></PageLoader> },
      { path: 'animeoftheday', element: <PageLoader><AnimeOfTheDayPage /></PageLoader> },
      { path: 'watchorder', element: <PageLoader><WatchOrderPage /></PageLoader> },
      { path: 'login', element: <PageLoader><LoginPage /></PageLoader> },
      { path: 'register', element: <PageLoader><RegisterPage /></PageLoader> },

      // Protected — login required
      { path: 'watchlist', element: <PageLoader><Protected feature="Watchlist"><WatchlistPage /></Protected></PageLoader> },
      { path: 'recommendations', element: <PageLoader><Protected feature="Recommendations"><RecommendationsPage /></Protected></PageLoader> },
      { path: 'profile', element: <PageLoader><Protected feature="Profile"><ProfilePage /></Protected></PageLoader> },
      { path: 'random', element: <PageLoader><Protected feature="Random Picker"><RandomPickerPage /></Protected></PageLoader> },
      { path: 'compare', element: <PageLoader><Protected feature="Anime Comparison"><ComparePage /></Protected></PageLoader> },
      { path: 'quiz', element: <PageLoader><Protected feature="Anime Quiz"><QuizPage /></Protected></PageLoader> },
      { path: 'recent', element: <PageLoader><Protected feature="Recently Viewed"><RecentlyViewedPage /></Protected></PageLoader> },
      { path: 'tierlist', element: <PageLoader><Protected feature="Tier List"><TierListPage /></Protected></PageLoader> },
      { path: 'thisorthat', element: <PageLoader><Protected feature="This or That"><ThisOrThatPage /></Protected></PageLoader> },
      { path: 'countdown', element: <PageLoader><Protected feature="Episode Countdown"><CountdownPage /></Protected></PageLoader> },
      { path: 'lists', element: <PageLoader><Protected feature="Custom Lists"><CustomListsPage /></Protected></PageLoader> },
      { path: 'export', element: <PageLoader><Protected feature="Export Data"><ExportPage /></Protected></PageLoader> },
      { path: 'map', element: <PageLoader><Protected feature="Anime World Map"><AnimeMapPage /></Protected></PageLoader> },
      { path: 'wrapped', element: <PageLoader><Protected feature="Year in Review"><YearInReviewPage /></Protected></PageLoader> },
      { path: 'achievements', element: <PageLoader><Protected feature="Achievements"><AchievementsPage /></Protected></PageLoader> },

      { path: '*', element: <PageLoader><NotFoundPage /></PageLoader> },
    ],
  },
]);

export default router;
