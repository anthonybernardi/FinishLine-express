/*
 * This file is part of NER's PM Dashboard and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { Route, Routes } from 'react-router-dom';
import { routes } from '../../routes';
import ChangeRequestDetails from '../ChangeRequestDetailPage/change-request-details';
import ChangeRequestsTable from './change-requests-table';
import CreateChangeRequest from '../CreateChangeRequestPage/create-change-request';

const ChangeRequests: React.FC = () => {
  return (
    <Routes>
      <Route path={routes.CHANGE_REQUESTS_NEW} element={CreateChangeRequest} />
      <Route path={routes.CHANGE_REQUESTS_BY_ID} element={ChangeRequestDetails} />
      <Route path={routes.CHANGE_REQUESTS} element={ChangeRequestsTable} />
    </Routes>
  );
};

export default ChangeRequests;
