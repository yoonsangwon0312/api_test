var express = require("express");
const moment = require("moment");
var router = express.Router();
const { prisma, run_prisma } = require("./Prisma_Models");
const Token_Models = require("../Models/Token_Models");
const MSG = require("../Models/Messages_Models");

class Test {
    constructor() {}

    async SendNote(sendid, recvid, title, content, relate_post) {
        const result = await run_prisma(
            prisma.rs_note.create({
                data: {
                    rs_member_rs_memberTors_note_not_send_id: {
                        connect: {
                            mem_idx: Number(sendid),
                        },
                    },
                    rs_member_rs_memberTors_note_not_recv_id: {
                        connect: {
                            mem_idx: Number(recvid),
                        },
                    },
                    rs_board_post: {
                        connect: {
                            pst_idx: Number(relate_post),
                        },
                    },
                    not_type: Number("0"),
                    not_title: title,
                    not_content: content,
                    not_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    not_timestemp: moment().unix(0),
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

    async ReceiveNote(sendid, recvid, title, content, relate_post) {
        const result = await run_prisma(
            prisma.rs_note.create({
                data: {
                    rs_member_rs_memberTors_note_not_send_id: {
                        connect: {
                            mem_idx: Number(sendid),
                        },
                    },
                    rs_member_rs_memberTors_note_not_recv_id: {
                        connect: {
                            mem_idx: Number(recvid),
                        },
                    },
                    rs_board_post: {
                        connect: {
                            pst_idx: Number(relate_post),
                        },
                    },
                    not_type: Number("1"),
                    not_title: title,
                    not_content: content,
                    not_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    not_timestemp: moment().unix(0),
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
    async NoteDelete(not_idx) {
        const result = await run_prisma(
            prisma.rs_note.delete({
                where: {
                    not_idx: Number(not_idx),
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
