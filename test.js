const { Decrement_Point } = require("./Models/point_Models")
const { run_prisma } = require("./Models/Prisma_Models")
var express = require("express");
const moment = require("moment");
var router = express.Router();
const { prisma, run_prisma } = require("./Prisma_Models");
const MSG = require("./Messages_Models");

async Decrement_Point(poi_mem_id, type, amount) {
    const userPoint = await run_prisma(
        prisma.rs_point.findUnique({
            where: {
                poi_mem_id: Number(poi_mem_id),
            },
        })
    );
    const { poi_point } = userPoint;
    const is_under_zero = poi_point - amount;
    const result = await run_prisma(
        prisma.rs_point.update({
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
    if (is_under_zero >= 0) {
        const result_log = await run_prisma(
            prisma.rs_point_log.create({
                data: {
                    poi_mem_id: Number(poi_mem_id),
                    poi_type: type,
                    poi_inc_poi: "-" + amount,
                    poi_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    poi_timestemp: moment().unix(0),
                },
            })
        );
    }
    if ((result_log.successful = false)) {
        return MSG.onError(99999);
    } else {
        return MSG.onSuccess(200);
    }
}





async Decrement_Point(poi_mem_id, amount) {
    const userPoint = await run_prisma(
        prisma.rs_point.findUnique({
            where: {
                poi_mem_id: Number(poi_mem_id),
            },
        })
    );
    const { poi_point } = userPoint;
    const is_under_zero = poi_point - amount;
    if (is_under_zero >= 0) {
        const result = await run_prisma(
            prisma.rs_point.update({
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
    } else {
        const result = await run_prisma(
            prisma.rs_point.update({
                where: {
                    poi_mem_id: Number(poi_mem_id),
                },
                data: {
                    poi_point: 0,
                },
            })
        );
    }
    if (result.successful === false) {
        console.log(result);
        return MSG.onError(99999);
    } else {
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
        return MSG.onSuccess(200);
    }
}