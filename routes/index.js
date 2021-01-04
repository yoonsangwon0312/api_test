var express = require("express");
var multer = require("multer");
const moment = require("moment");
var router = express.Router();
const mgr_Models = require("../Models/mgr_Models");
const mgrmem_Models = require("../Models/mgrmem_Models");
const { prisma, run_prisma } = require("../Models/Prisma_Models");
const point_Models = require("../Models/point_Models");
const Token_Models = require("../Models/Token_Models");
const { token } = require("morgan");
const note_Models = require("../Models/note_Models");

/* yoon sang won */

/* MemberGroup */
router.get("/mgr", function (req, res, next) {
    console.log(req.query);
    res.render(req.body);
});

router.post("/mgr", async function (req, res, next) {
    const { id, tit } = req.body;
    const create_mgr = await mgr_Models.CreateMgr(id, tit);
    console.log(create_mgr);
    res.send("complete");
});

router.post("/mgr_del", async function (req, res, next) {
    const { id } = req.body;
    const del_mgr = await mgr_Models.DeleteMgr(id);
    console.log(del_mgr);
    res.send("complete");
});

/* MemberGroupMember */
router.post("/mgrmem", async function (req, res, next) {
    const { memid, mgrid } = req.body;
    const cre_mgrmem = await mgrmem_Models.CreateMgrmem(memid, mgrid);
    console.log(cre_mgrmem);
    res.send("complete");
});

router.post("/mgrmem_del", async function (req, res, next) {
    const { id } = req.body;
    const del_mgrmem = await mgrmem_Models.Deletemgrmem(id);
    console.log(del_mgrmem);
    res.render("complete");
});

/* Point */
router.post("/point", async function (req, res, next) {
    const { poi_id, point } = req.body;
    const cre_point = await point_Models.CreatePoint(poi_id, point);
    console.log(cre_point);
    res.send("complete");
});

router.post("/pointinc", async function (req, res, next) {
    const { poi_mem_id, type, amount } = req.body;
    const inc_point = await point_Models.incrementPoint(poi_mem_id, type, amount);
    console.log(inc_point);
    res.sned("complete");
});

router.post("/pointdec", async function (req, res, next) {
    const { poi_mem_id, type, amount } = req.body;
    const dec_point = await point_Models.DecrementPoint(poi_mem_id, type, amount);
    console.log(dec_point);
    res.send("complete");
});

/* 쪽지 발송 */
router.post("/note", async function (req, res, next) {
    const token = req.header.tokenverify;
    const { sendid, recvid, title, content, file, relate_post } = req.body;
    const Token = await Token_Models.verify_access(token);
    const note = await note_Models.Note(sendid, recvid, title, content, relate_post);
    const note1 = await note_Models.Note1(sendid, recvid, title, content, relate_post);
    console.log(Token);
    console.log(note);
    console.log(note1);
    res.send("complete");
});

/* 쪽지삭제 */
router.post("/notedel", async function (req, res, next) {
    const token = req.header.tokenverify;
    const { not_idx } = req.body;
    const Token = await Token_Models.verify_access(token);
    const notedel = await note_Models.NoteDelete(not_idx);
    console.log(Token);
    console.log(notedel);
    res.send("complete");
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

module.exports = router;
