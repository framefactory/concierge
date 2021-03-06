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

import "reflect-metadata";
import { Field, Int, ID, ObjectType } from "type-graphql";

////////////////////////////////////////////////////////////////////////////////

@ObjectType()
export class AssetView
{
    @Field(type => [Asset])
    rows: Asset[];

    @Field(type => Int)
    count: number;
}

@ObjectType()
export class Asset
{
    @Field(type => Int)
    id: number;

    @Field(type => ID)
    uuid: string;

    @Field()
    binId: string;

    @Field()
    binUuid: string;

    @Field()
    filePath: string;

    @Field()
    path: string;

    @Field()
    name: string;

    @Field()
    extension: string;

    @Field()
    mimeType: string;

    @Field(type => Int)
    byteSize: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

