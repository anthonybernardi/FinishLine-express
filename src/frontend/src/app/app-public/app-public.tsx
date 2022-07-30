/*
 * This file is part of NER's PM Dashboard and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/auth.hooks';
import { useTheme } from '../../services/theme.hooks';
import { routes } from '../../routes';
import Login from '../../pages/LoginPage/login';
import AppAuthenticated from '../app-authenticated/app-authenticated';

const AppPublic: React.FC = () => {
  const auth = useAuth();
  const location = useLocation();
  const theme = useTheme();

  // eslint-disable-next-line prefer-destructuring
  document.body.style.backgroundColor = theme.bgColor;

  return (
    <html className={theme.className}>
      <Routes>
        <Route path={routes.LOGIN}>
          <Login postLoginRedirect={{ url: location.pathname, search: location.search }} />
        </Route>
        <Route
          path="*"
          element={() =>
            auth.user === undefined ? <Navigate to={routes.LOGIN} /> : <AppAuthenticated />
          }
        />
      </Routes>
    </html>
  );
};

export default AppPublic;
