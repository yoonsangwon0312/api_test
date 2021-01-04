var express = require("express");
const moment = require("moment");
var router = express.Router();
const { prisma, run_prisma } = require("./Prisma_Models");

class Test {
    constructor() {}
    async CreatePoint(poi_id, point, poi_type) {
        const result = await run_prisma(
            prisma.rs_point.create({
                data: {
                    poi_mem_id: Number(poi_id),
                    poi_point: Number(point),
                    poi_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    poi_timestemp: moment().unix(0),
                },
            })
        );
        if (result.successful === false) {
            console.log(result);
            return MSG.onError(99999);
        }
    }

    async incrementPoint(poi_mem_id, type, amount) {
        const result_log = await run_prisma(
            prisma.rs_point_log.create({
                data: {
                    poi_mem_id: Number(poi_mem_id),
                    poi_type: type,
                    poi_inc_poi: "+" + amount,
                    poi_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    poi_timestemp: moment().unix(0),
                },
            })
        );
        if (result.successful === false) {
            console.log(result);
            return MSG.onError(99999);
        }
        const result = await run_prisma(
            prisma.rs_point.updateMany({
                where: {
                    poi_mem_id: Number(poi_mem_id),
                },
                data: {
                    poi_point: {
                        increment: Number(amount),
                    },
                },
            })
        );
        if (result.successful === false) {
            console.log(result);
            return MSG.onError(99999);
        }
    }

    async DecrementPoint(poi_mem_id, type, amount) {
        const result_log = await run_prisma(
            prisma.rs_point_log.create({
                data: {
                    poi_mem_id: Number(poi_mem_id),
                    poi_type: type,
                    poi_inc_poi: "-" + amount,
                    poi_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    poi_timestemp: moment().unix(),
                },
            })
        );
        const result = await run_prisma(
            prisma.rs_point.updateMany({
                where: {
                    poi_mem_id: Number(poi_mem_id),
                },
                data: {
                    poi_point: {
                        decrement: Number(amount),
                    },
                },
            })
        );
        return result;
    }
}

module.exports = new Test();
