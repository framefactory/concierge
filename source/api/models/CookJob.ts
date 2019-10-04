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

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";

import Project from "./Project";

////////////////////////////////////////////////////////////////////////////////

@Table
export default class CookJob extends Model<CookJob>
{
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true })
    uuid: string;

    @Column
    recipeId: string;

    @Column({ type: DataType.JSON })
    parameters: object;

    @ForeignKey(() => Project)
    @Column
    projectId: number;

    @BelongsTo(() => Project)
    project: Project;
}