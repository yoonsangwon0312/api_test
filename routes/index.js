var express = require("express");
var multer = require("multer");
const moment = require("moment");
var router = express.Router();
const MSG = require("../Models/Messages_Models");
const mgr_Models = require("../Models/mgr_Models");
const mgrmem_Models = require("../Models/mgrmem_Models");
const { prisma, run_prisma } = require("../Models/Prisma_Models");
const point_Models = require("../Models/point_Models");
const Token_Models = require("../Models/Token_Models");
const { token } = require("morgan");
const note_Models = require("../Models/note_Models");
const { route } = require("./test");

/* yoon sang won */

/* MemberGroupCreate */
router.use(token_verify);
router.post("/mgr", async function (req, res, next) {
    const tokendata = req.tokeninfo;
    console.log(tokendata);
    const { id, tit } = req.body;
    const create_mgr = await mgr_Models.CreateMgr(id, tit);
    console.log(create_mgr);
    if (create_mgr.successful === false) {
        res.json("멤버그룹 생성 실패");
    } else {
        res.json("멤버 그룹 생성 성공");
    }
});

/* MemberGroupDelte */
router.use(token_verify);
router.post("/mgr_del", async function (req, res, next) {
    const tokendata = req.tokeninfo;
    console.log(tokendata);
    const { id } = req.body;
    const del_mgr = await mgr_Models.DeleteMgr(id);
    console.log(del_mgr);
    if (del_mgr.successful === false) {
        res.json("삭제 실패");
    } else {
        res.json("삭제 완료");
    }
});

/* MemberGroupMember insert */
router.use(token_verify);
router.post("/mgrmem", async function (req, res, next) {
    const tokendata = req.tokeninfo;
    console.log(tokendata);
    const { memid, mgrid } = req.body;
    const cre_mgrmem = await mgrmem_Models.CreateMgrmem(memid, mgrid);
    console.log(cre_mgrmem);
    if (cre_mgrmem.successful === false) {
        res.json("멤버 등록 실패");
    } else {
        res.json("멤버 등록 성공");
    }
});

/*Meber Group Member delete */
router.use(token_verify);
router.post("/mgrmem_del", async function (req, res, next) {
    const tokendata = req.tokeninfo;
    console.log(tokendata);
    const { id } = req.body;
    const del_mgrmem = await mgrmem_Models.Deletemgrmem(id);
    console.log(del_mgrmem);
    if (del_mgrmem.successful === false) {
        res.json("멤버가 그룹에서 삭제 실패.");
    } else {
        res.json("멤버가 그룹에서 삭제 성공.");
    }
});

// 포인트 부분 멤버로 합쳤음 //
/* Point */
// router.post("/point", async function (req, res, next) {
//     const { poi_id, point } = req.body;
//     const cre_point = await point_Models.CreatePoint(poi_id, point);
//     console.log(cre_point);
//     if (cre_point.successful === false) {
//         res.json("포인트 생성 실패");
//     } else {
//         res.json("포인트 생성 완료");
//     }
// });

/*포인트 증가시키기 */

router.use(token_verify);
router.post("/pointinc", async function (req, res, next) {
    const tokendata = tokeninfo;
    console.log(tokendata);
    const { mem_idx, type, amount } = req.body;
    const inc_point = await point_Models.incrementPoint(mem_idx, type, amount);
    console.log(inc_point);
    if (inc_point.successful === false) {
        res.json("포인트 지급 실패");
    } else {
        res.json("포인트 지급 성공");
    }
});

// Middleware;
/*포인트 감소시키기 */

router.post("/pointdec", token_verify);
router.post("/pointdec", async function (req, res, next) {
    const tokendata = req.tokeninfo;
    console.log(tokendata);
    const { mem_idx, type, amount } = req.body;
    const decpoint = await point_Models.Decrement_Point(mem_idx, amount, type);
    console.log(decpoint);
    if (decpoint.successful === false) {
        res.json("포인트 차감 실패");
    } else {
        res.json("포인트 차감 성공");
    }
});

/* 쪽지 발송 */
router.use(token_verify);
router.post("/note", async function (req, res, next) {
    const tokendata = tokeninfo;
    console.log(tokendata);
    const { sendid, recvid, title, content, relate_post } = req.body;
    const sendnot = await note_Models.SendNote(sendid, recvid, title, content, relate_post);
    const recvnot = await note_Models.ReceiveNote(sendid, recvid, title, content, relate_post);
    console.log(sendnot);
    console.log(recvnot);
    if (sendnot.successful === false) {
        res.json("쪽지 전송 실패.");
    } else {
        res.json("쪽지가 전송되었습니다.");
    }
});

/* 쪽지삭제 */
router.use(token_verify);
router.post("/notedel", async function (req, res, next) {
    const tokendata = tokeninfo;
    console.log(tokendata);
    const { not_idx } = req.body;
    const notedel = await note_Models.NoteDelete(not_idx);
    console.log(notedel);
    if (notedel.successful === false) {
        res.json(" 쪽지 삭제 실패");
    } else {
        res.json("쪽지 삭제 성공");
    }
});

/* Access 토큰 생성 및 인증 */
router.post("/token", async function (req, res, next) {
    const createToken = await Token_Models.generateAccessToken({ name: 12123 });
    console.log(createToken);
    res.json(createToken);
});
router.post("/tokenverify", async function (req, res, next) {
    const tokenverify = await Token_Models.verify_access(req.body.tokenverify);
    console.log(tokenverify);
    res.json(tokenverify);
});

async function token_verify(req, res, next) {
    const token = req.headers.tokenverify;
    const Token = await Token_Models.verify_access(token);
    if (Token.successful === false) {
        res.json("Token Error");
        return;
    } else {
        req.tokeninfo = Token.data;
        return next();
    }
}

module.exports = router;
