var express = require("express");
const moment = require("moment");
var router = express.Router();
const { prisma, run_prisma } = require("./Prisma_Models");
const MSG = require("./Messages_Models");

class Test {
    constructor() {}
    async CreatePoint(poi_id, point) {
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
        } else {
            return MSG.onSuccess(200);
        }
    }

    async incrementPoint(mem_idx, type, amount) {
        //포인트 값 증가
        const result = await run_prisma(
            prisma.rs_member.update({
                where: {
                    mem_idx: Number(mem_idx),
                },
                data: {
                    mem_point: {
                        increment: Number(amount),
                    },
                },
            })
        );
        //result.successful
        if (result.successful === false) {
            return MSG.onError(99999);
        } else {
            const result_log = await run_prisma(
                prisma.rs_point_log.create({
                    data: {
                        poi_mem_id: Number(mem_idx),
                        poi_type: type,
                        poi_inc_poi: "+" + amount,
                        poi_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                        poi_timestemp: moment().unix(0),
                    },
                })
            );
            return MSG.onSuccess(200);
        }
    }

    async Decrement_Point(mem_idx, amount, type) {
        const userPoint = await run_prisma(
            prisma.rs_member.findUnique({
                where: {
                    mem_idx: Number(mem_idx),
                },
            })
        );
        console.log(userPoint);
        const { poi_point } = userPoint.data;
        console.log(poi_point);
        const is_under_zero = poi_point - amount;
        console.log(is_under_zero);

        let result;
        if (is_under_zero >= 0) {
            result = await run_prisma(
                prisma.rs_member.update({
                    where: {
                        mem_idx: Number(mem_idx),
                    },
                    data: {
                        mem_point: {
                            decrement: Number(amount),
                        },
                    },
                })
            );
        } else {
            result = await run_prisma(
                prisma.rs_member.update({
                    where: {
                        mem_idx: Number(mem_idx),
                    },
                    data: {
                        mem_point: 0,
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
                        poi_mem_id: Number(mem_idx),
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
}

module.exports = new Test();
