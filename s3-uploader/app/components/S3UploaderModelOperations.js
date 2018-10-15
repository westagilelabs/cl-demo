const { S3UploaderModel } = require('./S3UploaderModel')
// import S3UploaderModel from './S3UploaderModel';

// exports.listAll = async function () {
//    const items = await TodoItem.findAll ()
//    return items.map(e => e.toJSON())
// }
//
// exports.updateStatus = async function (id) {
//    const todo = await TodoItem.findOne({where : { id : id}})
//    todo.status = !todo.status
//    return todo.save()
// }
//
// exports.deleteTodo = async function (id) {
//    const todo = await TodoItem.destroy({where : { id : id }})
//    return todo
// }
//
// exports.deleteChecked = async function (data) {
//    const todos = await TodoItem.destroy({
//        where : {id : data}
//    })
//    return todos
// }
exports.deleteAllFiles = async function () {
   return await S3UploaderModel.destroy({
      where: {},
      truncate: true
   })
}

exports.softDeleteAllFiles = async function () {
  return await S3UploaderModel.update(
      { action_type: 'DELETE_FILE', connectivity: 0, is_deleted: 1 },
      { where: {} }
    );
}

exports.deleteFile = async function (id) {
   return await S3UploaderModel.destroy({where : {_id : id}})
}

exports.updateFile = async function (model) {
  let items = await S3UploaderModel.findOne({where : { _id: model._id}})
  return items.update(model,{ where: { _id: model._id } })
}

exports.getFileInfoById = async function (id) {
   const items = await S3UploaderModel.findOne({where : { _id : id}})
   return items;
}

exports.getAllFiles = async function () {
   const items = await S3UploaderModel.findAll({where: {is_deleted: 0}})
   return items.map(e => e.toJSON())
}

exports.newFile = function (fileObj) {
    return S3UploaderModel.create(fileObj);
}
