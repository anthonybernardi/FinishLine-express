/*
 * This file is part of NER's PM Dashboard and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import React, { useEffect, useState } from 'react';

const AppMain: React.FC = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    fetch('/getAllProjects')
      .then((res) => res.json())
      .then((data) => setUsers(data.projects));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{JSON.stringify(users)}</p>
      </header>
    </div>
  );
};

export default AppMain;
