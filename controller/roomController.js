const util = require('util');
const db = require('../model/db')
const query = util.promisify(db.query).bind(db);
module.exports.getAllRoom=async function(req,res,next)
{
    try{        
        const data = await query('Select * From phong');
        res.json(data);
    }catch(error){
        console.log(error)
        res.status(500).json({msg : 'error'})
    }
}
module.exports.addRoom = async function(req,res,next)
{
    let {LoaiP,GiaThue,KhuyenMai,SoNguoiToiDa,MoTa,TrangThai,MaNV}=req.body
    LoaiP === undefined ? null: LoaiP
    GiaThue === undefined ? null: GiaThue
    KhuyenMai === undefined ? null: KhuyenMai
    SoNguoiToiDa === undefined ? null: SoNguoiToiDa
    MoTa === undefined ? null: MoTa 
    TrangThai = 'San Sang'
    MaNV = '1'
    try{
        const status = await query(`Insert Into phong (LoaiP,GiaThue,KhuyenMai,SoNguoiToiDa,MoTa,TrangThai,MaNV) VALUES ('${LoaiP}','${GiaThue}','${KhuyenMai}','${SoNguoiToiDa}','${MoTa}','${TrangThai}','${MaNV}')`)
        res.status(200).json({msg:'oke'})
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"error"})
    }
    
}
module.exports.deleteRoom = async function (req,res,next)
{
    try{
        const status = await query(`Delete From phong Where MaP = ${req.params.id}`);
        res.status(200).json({msg:'Oke'})
    }catch(error)
    {
        console.log(error)
        res.status(500).json({msg:'error'});   
    }
}
module.exports.getRoom = async function(req,res,next)
{
    try{
        const data = await query(`Select * From phong Where MaP = '${req.params.id}'`)
        res.status(200).json(data)
    }catch(error)
    {
        console.log(error)
        res.status(500).json({msg:'error'});
    }
}
module.exports.updateRoom = async function(req,res,next){
    let {LoaiP,GiaThue,KhuyenMai,SoNguoiToiDa,MoTa,TrangThai}=req.body
    try{
        // const status = await query(`Update phong Set LoaiP = ${LoaiP} , GiaThue = ${GiaThue} , KhuyenMai = ${KhuyenMai} , SoNguoiToiDa = ${SoNguoiToiDa} , MoTa = ${MoTa} , TrangThai = ${TrangThai} Where MaP = ${req.params.id}`);
        let status = await query('Update phong Set LoaiP = ?,GiaThue=?,KhuyenMai=?,SoNguoiToiDa=?,MoTa=?,TrangThai=? Where MaP = ?',[LoaiP,GiaThue,KhuyenMai,SoNguoiToiDa,MoTa,TrangThai,req.params.id])
        res.status(200).json({msg:'Oke'})
    }catch(error)
    {
        console.log(error)
        res.status(500).json({msg:"Error"})
    }
}
module.exports.phieudatphong = async function (req,res,next){
    try{
        const data = await query(`Select * From phieudatphong As p, khachang As k Where p.MaKH=k.MaKH`)
        res.status(200).json(data)
    }catch(error)
    {
        console.log(error)
        res.status(500).json({msg:"Error"})
    }
}
// module.exports.deleteRoom = async function (req,res,next)
// {
//     try{
//         const status = await query(`Delete From phong Where MaP = '${req.params.id}'`);
//     }catch(error)
//     {
//         console.log(error)
//         res.status(500).json({msg:'error'});   
//     }
// }

