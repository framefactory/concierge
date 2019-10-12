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

import { Container } from "typedi";

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";

import Asset from "./Asset";
import Bin from "./Bin";
import Item from "./Item";
import Subject from "./Subject";

import Job, { IJobImplementation } from "./Job";

import CookClient, { IParameters } from "../utils/CookClient";
import { IJobReport } from "../utils/cookTypes";
import EDANClient from "../utils/EDANClient";
import BinType from "./BinType";

////////////////////////////////////////////////////////////////////////////////

export type MigrationJobStep = "process" | "fetch" | "";

@Table
export default class PlayMigrationJob extends Model<PlayMigrationJob> implements IJobImplementation
{
    static readonly typeName: string = "PlayMigrationJob";
    protected static cookPollingInterval = 3000;

    ////////////////////////////////////////////////////////////////////////////////
    // SCHEMA

    // the base job
    @ForeignKey(() => Job)
    @Column
    jobId: number;

    @BelongsTo(() => Job)
    job: Job;

    // the item generated from this job
    @ForeignKey(() => Item)
    @Column
    itemId: number;

    @BelongsTo(() => Item)
    item: Item;

    @Column({ type: DataType.STRING, defaultValue: "" })
    step: MigrationJobStep;

    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    cookJobId: string;

    @Column({ allowNull: false })
    object: string;

    @Column({ allowNull: false })
    playboxId: string;

    @Column
    edanRecordId: string;

    @Column
    unitRecordId: string;

    @Column
    sharedDriveFolder: string;

    @Column
    masterModelGeometry: string;

    @Column
    masterModelTexture: string;

    @Column({ defaultValue: "Circle" }) // Standard, Extended, Circle
    annotationStyle: string;

    @Column({ defaultValue: false })
    migrateAnnotationColor: boolean;

    ////////////////////////////////////////////////////////////////////////////////

    protected timerHandle = null;

    async run(job: Job)
    {
        if (this.jobId !== job.id) {
            throw new Error(`job id mismatch: Job ${job.id } !== ${this.jobId}`);
        }

        const cookClient = Container.get(CookClient);

        this.job = job;
        this.step = "process";

        return this.save()
        .then(() => {
            const params: IParameters = {
                boxId: parseInt(this.playboxId),
                annotationStyle: this.annotationStyle,
                migrateAnnotationColor: !!this.migrateAnnotationColor,
            };

            return cookClient.createJob(this.cookJobId, "migrate-play", params);
        })
        .then(() => cookClient.runJob(this.cookJobId))
        .then(() => {
            this.timerHandle = setInterval(() => this.monitor(job), PlayMigrationJob.cookPollingInterval);
        })
        .catch(err => {
            this.step = "";
            return this.save().then(() => { throw err; });
        });
    }

    async cancel()
    {
        const cookClient = Container.get(CookClient);

        const step = this.step;
        this.step = "";

        return this.save()
        .then(() => {
            if (step === "process") {
                return cookClient.cancelJob(this.cookJobId);
            }
        });
    }

    async delete()
    {
        const cookClient = Container.get(CookClient);

        if (this.step === "process") {
            return cookClient.deleteJob(this.cookJobId)
                .finally(() => this.destroy());
        }
        else if (this.step === "fetch") {
            // can't delete during fetch
            return Promise.reject(new Error("can't delete while fetching assets"));
        }

        return this.destroy();
    }

    protected async monitor(job: Job)
    {
        console.log(`[PlayMigrationJob] - monitoring job ${job.id} (${job.state}): ${job.name}`);

        if (this.step !== "process") {
            return;
        }

        const cookClient = Container.get(CookClient);

        return cookClient.jobInfo(this.cookJobId)
        .then(jobInfo => {
            if (jobInfo.state === "done") {
                clearInterval(this.timerHandle);
                this.step = "fetch";
                return this.save()
                    .then(() => this.postProcessingStep(job));
            }
            if (!jobInfo || jobInfo.state !== "running") {
                const message = jobInfo ? jobInfo.error || "Cook job not running" : "Cook job not found";
                throw new Error(message);
            }

        })
        .catch(error => {
            this.step = "";
            job.state = "error";
            job.error = error.message;
            return Promise.all([ this.save(), this.job.save() ]);
        });
    }

    protected async postProcessingStep(job: Job)
    {
        const cookClient = Container.get(CookClient);
        const edanClient = Container.get(EDANClient);

        let report: IJobReport = undefined;
        let record = undefined;

        return cookClient.jobReport(this.cookJobId)
            .then(_report => {
                report = _report;

                return edanClient.fetchMdmRecord(this.edanRecordId)
                    .then(_record => record = _record)
                    .catch(() => {});
            })
            .then(() => {
                const subject: any = {
                    name: this.object,
                    edanRecordId: this.edanRecordId,
                    unitRecordId: this.unitRecordId,
                };
                if (record) {
                    subject.edanRecordCache = record;
                }

                return Subject.create(subject);
            })
            .then(subject => Item.create({
                name: this.object,
                subjectId: subject.id,
            }))
            .then(item => Bin.create({
                name: this.object,
                typeId: BinType.presets.voyager,
            }))
            .then(bin => {

            })
            .then(() => {
                this.step = "";
                job.state = "done";

                return Promise.all([ this.save(), job.save() ]);
            });
    }
}