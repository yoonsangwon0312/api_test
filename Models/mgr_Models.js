var express = require("express");
const moment = require("moment");
var router = express.Router();
const { prisma, run_prisma } = require("./Prisma_Models");
const MSG = require("./Messages_Models");

class Test {
    constructor() {}

    async CreateMgr(id, tit) {
        const result = await run_prisma(
            prisma.rs_mgr.create({
                data: {
                    mgr_id: Number(id),
                    mgr_title: tit,
                    mgr_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    mgr_timestemp: moment().unix(),
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

    async DeleteMgr(id) {
        const result = await run_prisma(
            prisma.rs_mgr.delete({
                where: {
                    mgr_id: Number(id),
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
