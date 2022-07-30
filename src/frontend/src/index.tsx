/*
 * This file is part of NER's PM Dashboard and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import React from 'react'
import ReactDOM from 'react-dom'
import AppMain from './app/app-main/app-main'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
    <React.StrictMode>
        <AppMain />
    </React.StrictMode>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()