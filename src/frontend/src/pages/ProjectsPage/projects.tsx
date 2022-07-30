/*
 * This file is part of NER's PM Dashboard and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { Route, Routes } from 'react-router-dom';
import { routes } from '../../routes';
import ProjectsView from './projects-view';
import WBSDetails from '../WbsDetailsSwitchPage/wbs-details';
import CreateProjectForm from '../CreateProjectPage/create-project-form';
import CreateWPForm from '../CreateWorkPackagePage/create-wp-form';

const Projects: React.FC = () => {
  return (
    <Routes>
      <Route path={routes.WORK_PACKAGE_NEW} element={<CreateWPForm />} />
      <Route path={routes.PROJECTS_NEW} element={<CreateProjectForm />} />
      <Route path={routes.PROJECTS_BY_WBS} element={<WBSDetails />} />
      <Route path={routes.PROJECTS} element={<ProjectsView />} />
    </Routes>
  );
};

export default Projects;
