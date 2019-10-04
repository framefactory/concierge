/**
 * 3D Foundation Project
 * Copyright 2019 Smithsonian Institution
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import MigrationSpreadsheetView from "../views/MigrationSpreadsheetView";
import Page, { IPageView } from "../Page";

////////////////////////////////////////////////////////////////////////////////

const views: IPageView[] = [
    { title: "Spreadsheet", component: MigrationSpreadsheetView, route: "/spreadsheet" },
    { title: "Migrate Play", component: null, route: "/play" },
    { title: "Migrate Legacy", component: null, route: "/legacy" },
];

export interface IPageProps
{
    onNavigatorToggle: () => void;
}

export default (props: IPageProps) => (
    <Page
        title="Migration"
        views={views}
        {...props}
    />
);
