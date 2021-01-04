var express = require('express');
const moment = require('moment');
var router = express.Router();
const { prisma, run_prisma } = require("./Prisma_Models");


class Test {
    constructor(){

    }

    async CreateMgr(id, tit){
        const result = await run_prisma(
          prisma.rs_mgr.create({
            data:{
              mgr_id:Number(id),
              mgr_title:tit,
              mgr_datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
              mgr_timestemp:moment().unix()
            }
          })
        );
          return result;
    }

    async DeleteMgr(id){
      const result = await run_prisma(
        prisma.rs_mgr.deleteMany({
          where : {
            mgr_id : Number(id)
          }
        })
      );
      return result;
    }
    
}


module.exports = new Test();