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

import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from "sequelize-typescript";

import Asset from "./Asset";
import Bin from "./Bin";

////////////////////////////////////////////////////////////////////////////////

@Table
export default class Scene extends Model<Scene>
{
    static async findSceneByBinId(binId: number): Promise<Scene | undefined>
    {
        return Scene.findOne({
            include: [ Bin, Asset ],
            where: { binId },
        });
    }

    static async findSceneById(sceneId: number): Promise<Scene | undefined>
    {
        return Scene.findByPk(sceneId, { include: [ Bin, Asset ]});
    }

    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true })
    uuid: string;

    @Column
    name: string;

    @ForeignKey(() => Bin)
    @Column({ type: DataType.INTEGER })
    binId: number;

    @BelongsTo(() => Bin)
    bin: Bin;

    @ForeignKey(() => Asset)
    @Column({ type: DataType.INTEGER })
    voyagerDocumentId: number;

    @BelongsTo(() => Asset)
    voyagerDocument: Asset;

    @Column
    voyagerVersion: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    published: boolean;
}
