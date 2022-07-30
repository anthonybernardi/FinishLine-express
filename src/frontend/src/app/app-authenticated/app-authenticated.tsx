/*
 * This file is part of NER's PM Dashboard and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { Navigate, Route, Routes } from 'react-router-dom';
import { routes } from '../../routes';
import ChangeRequests from '../../pages/ChangeRequestsPage/change-requests';
import Projects from '../../pages/ProjectsPage/projects';
import { PageNotFound } from '../../pages/PageNotFoundPage/page-not-found';
import Home from '../../pages/HomePage/home';
import NavTopBar from '../../layouts/nav-top-bar/nav-top-bar';
import Settings from '../../pages/SettingsPage/settings';
import HelpPage from '../../pages/HelpPage/HelpPage';
import Sidebar from '../../layouts/sidebar/sidebar';
import TeamsPage from '../../pages/TeamsPage/TeamsPage';

const styles = {
  content: {
    marginTop: '4rem',
    marginLeft: '85px'
  }
};

const AppAuthenticated: React.FC = () => {
  return (
    <>
      <NavTopBar />
      <div>
        <Sidebar />
        <div style={styles.content}>
          <Routes>
            <Route path={routes.PROJECTS} element={Projects} />
            <Route
              path={routes.CR_BY_ID}
              element={() => <Navigate to={routes.CHANGE_REQUESTS_BY_ID} />}
            />
            <Route path={routes.CHANGE_REQUESTS} element={ChangeRequests} />
            <Route path={routes.TEAMS} element={TeamsPage} />
            <Route path={routes.SETTINGS} element={Settings} />
            <Route path={routes.HELP} element={HelpPage} />
            <Route path={routes.HOME} element={Home} />
            <Route path="*" element={PageNotFound} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default AppAuthenticated;
