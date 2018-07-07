var express = require('express');
var router = express.Router();
var geneapi = require('../mongodb/genebusiness/geneapi.js')


router.get("/GetGeneData", geneapi.GetGeneData)
router.get("/GetMaxAndMinNumber", geneapi.GetMaxAndMinNumber)
router.post("/UploadFile", geneapi.UploadFile)
router.get("/GetFileList", geneapi.GetFileList)
router.post("/InserGeneData", geneapi.InsertGeneData2MongoDB)
router.post("/InserTrackData", geneapi.InsertTrackData2MongoDB)
router.get("/GetFileLen", geneapi.GetFileLen)
router.get("/CheckData", geneapi.CheckData)
router.post("/RemoveData", geneapi.RemoveData)
router.get("/GetGeneDataClass", geneapi.GetGeneDataClass)
router.get("/GetUploadFileList", geneapi.GetUploadFileList)
router.get("/GetGeneDataList", geneapi.GetGeneDataList)
router.get("/CheckFile", geneapi.CheckFile)
router.post("/Upload2mongo", geneapi.Upload2mongo)


router.post("/CreateSpecies", geneapi.CreateSpecies)
router.get("/ListSpecies", geneapi.ListSpecies)
router.get("/DelSpecies", geneapi.DelSpecies)

router.post("/CreateProject", geneapi.CreateProject)
router.get("/ListProject", geneapi.ListProject)
router.get("/DelProject", geneapi.DelProject)

router.get("/GetUsersByProj", geneapi.GetUsersByProj)
router.post("/UpdateProjUser", geneapi.UpdateProjUser)
router.get("/GetGeneByProj", geneapi.GetGeneByProj)
router.post("/UpdateProjGene", geneapi.UpdateProjGene)
router.get("/GetTrackByProj", geneapi.GetTrackByProj)
router.post("/UpdateProjTrack", geneapi.UpdateProjTrack)



router.get("/GetProjbyUserandSp", geneapi.GetProjbyUserandSp)
router.get("/GetCurrentGene", geneapi.GetCurrentGene)
//router.get("/GetTrackdataByProj", geneapi.GetTrackdataByProj)

router.get("/mongodbtest", geneapi.mongodbtest)

module.exports = router;