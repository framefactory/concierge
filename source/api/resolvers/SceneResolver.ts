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

import { Arg, Int, Query, Resolver } from "type-graphql";

import { Scene, SceneView } from "../schemas/Scene";
import { ViewParameters, getFindOptions } from "../schemas/View";

import SceneModel from "../models/Scene";
import AssetModel from "../models/Asset";
import BinModel from "../models/Bin";
import ItemBinModel from "../models/ItemBin";
import ItemModel from "../models/Item";

////////////////////////////////////////////////////////////////////////////////

@Resolver()
export default class SceneResolver
{
    @Query(returns => SceneView)
    async sceneView(
        @Arg("subjectId", type => Int, { nullable: true }) subjectId: number,
        @Arg("itemId", type => Int, { nullable: true }) itemId: number,
        @Arg("binId", type => Int, { nullable: true }) binId: number,
        @Arg("view", type => ViewParameters) view: ViewParameters,
    ): Promise<SceneView>
    {
        let options;

        if (binId) {
            options = {
                where: { binId },
                include: [ BinModel, AssetModel ],
            };
        }
        else if (itemId) {
            options = {
                include: [ AssetModel, {
                    model: BinModel,
                    required: true,
                    include: [{
                        model: ItemBinModel,
                        attributes: [],
                        where: { itemId }
                    }],
                }],
            };
        }
        else if (subjectId) {
            options = {
                include: [ AssetModel, {
                    model: BinModel,
                    required: true,
                    include: [{
                        model: ItemBinModel,
                        required: true,
                        attributes: [],
                        include: [{
                            model: ItemModel,
                            attributes: [],
                            where: { subjectId }
                        }],
                    }],
                }],
            };
        }
        else {
            options = {
                include: [ BinModel, AssetModel ]
            };
        }

        const findOptions = getFindOptions(view, null, options);

        return SceneModel.findAndCountAll(findOptions)
        .then(result => ({
            rows: result.rows.map(row => row.toJSON() as Scene),
            count: result.count,
        }));
    }

    @Query(returns => Scene, { nullable: true })
    async scene(
        @Arg("id", type => Int) id: number,
    ): Promise<Scene | null>
    {
        if (id) {
            return SceneModel.findByPk(id, { include: [ AssetModel ]})
                .then(row => row ? row.toJSON() as Scene : null);
        }

        return Promise.resolve(null);
    }
}