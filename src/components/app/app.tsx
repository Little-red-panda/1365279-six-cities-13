import { Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PrivateRoute, PublicRoute } from '../access-route/access-route';
import MainPage from '../../pages/main-page/main-page';
import LoginPage from '../../pages/login-page/login-page';
import FavoritesPage from '../../pages/favorites-page/favorites-page';
import OfferPage from '../../pages/offer-page/offer-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import { AppRoute, AuthorizationStatus } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import HistoryRouter from '../history-router/history-router';
import browserHistory from '../../browser-history';
import { getAuthorizationStatus } from '../../store/user-process/selector';
import { getErrorStatus } from '../../store/offers-data/selector';
import { ErrorScreen } from '../../pages/error-page/error-page';
import { useEffect } from 'react';
import { fetchFavoritesAction } from '../../store/api-actions';
import LoadingScreen from '../../pages/loading-page/loading-page';

function App(): JSX.Element {
	const dispatch = useAppDispatch();
	const authorizationStatus = useAppSelector(getAuthorizationStatus);
	const hasError = useAppSelector(getErrorStatus);

	useEffect(() => {
		if (authorizationStatus === AuthorizationStatus.Auth) {
			dispatch(fetchFavoritesAction());
		}
	}, [authorizationStatus, dispatch]);

	if (hasError) {
		return <ErrorScreen />;
	}

	if (authorizationStatus === AuthorizationStatus.Unknown) {
		return <LoadingScreen />;
	}

	return (
		<HelmetProvider>
			<HistoryRouter history={browserHistory}>
				<Routes>
					<Route path={AppRoute.Main} element={<MainPage />} />
					<Route
						path={AppRoute.Login}
						element={
							<PublicRoute status={authorizationStatus}>
								<LoginPage />
							</PublicRoute>
						}
					/>
					<Route
						path={AppRoute.Favorites}
						element={
							<PrivateRoute status={authorizationStatus}>
								<FavoritesPage />
							</PrivateRoute>
						}
					/>
					<Route path={`${AppRoute.Offer}/:offerId`} element={<OfferPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</HistoryRouter>
		</HelmetProvider>
	);
}

export default App;
