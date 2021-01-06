var express = require("express");
const moment = require("moment");
var router = express.Router();
const { prisma, run_prisma } = require("./Prisma_Models");
const MSG = require("./Messages_Models");

class Test {
    constructor() {}

    async CreateMgrmem(memid, mgrid) {
        const result = await run_prisma(
            prisma.rs_mgr_mem.create({
                data: {
                    rs_member: {
                        connect: {
                            mem_idx: Number(memid),
                        },
                    },
                    rs_mgr: {
                        connect: {
                            mgr_id: Number(mgrid),
                        },
                    },
                    mgm_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    mgm_timestemp: moment().unix(),
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

    async Deletemgrmem(id) {
        const result = await run_prisma(
            prisma.rs_mgr_mem.delete({
                where: {
                    mgm_mem_idx: Number(id),
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
}

module.exports = new Test();
