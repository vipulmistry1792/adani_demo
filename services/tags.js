const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  //const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    'SELECT id as Id,tag_name as TagName,device_name as DeviceName,device_id as DeviceNo,data_type as DataType,prototype as Protocol,start_address as StartAdd,qty as Qty,device_add as DeviceAdd,dataread_type as FunctionType,table_name as TableName  FROM tags_master'
  );
  const data = helper.emptyOrRows(rows);
  //const meta = {page};

  return data;
}
async function getRTUTags(prototype = "Modbus RTU"){
  const offset = helper.getOffset(1, config.listPerPage);
  const rows = await db.query(
    'SELECT * FROM tags_master where prototype=?', 
    [prototype]
  );
  const data = helper.emptyOrRows(rows);
  //const meta = {page};

  return data;
}
function validateCreate(tag) {
    let messages = [];
  
    console.log(tag);
  
    if (!tag) {
      messages.push('No object is provided');
    }
  
    if (!tag.tag_name) {
      messages.push('tagname is empty');
    }
    if (!tag.device_id) {
        messages.push('device is empty');
      }
      if (tag.device_id<=0) {
        messages.push('deviceid  is Greater Then 0');
      }
      if (!tag.device_name) {
        messages.push('devicename is empty');
      } 
      if (!tag.tag_type) {
        messages.push('TagType is empty');
      } 
      if (!tag.start_add) {
        messages.push('Starting Address is empty');
      } 
      if (tag.start_add<0) {
        messages.push('Starting Address is Negative or Zero');
      } 
      if (!tag.prototype) {
        messages.push('Protocol is empty');
      }     
  if (tag.tag_name && tag.tag_name.length > 255) {
      messages.push('TagName cannot be longer than 255 characters');
    }
  
    if (tag.device_name && tag.device_name.length > 255) {
      messages.push('Device name cannot be longer than 255 characters');
    }
  
    if (messages.length) {
      let error = new Error(messages.join());
      error.statusCode = 400;
  
      throw error;
    }
  }
async function datafiled(tag)
{
  var col_name=tag.device_name+'_'+tag.tag_name;
  var result;
  if (tag.prototype=='Modbus RTU')
  {
    result = await db.query(`ALTER TABLE serial_data ADD ${col_name} varchar(255)`);
  }
  else{
    result = await db.query(`ALTER TABLE modbustcp_data ADD ${col_name} varchar(255)`);
  }
 
  console.log(result)
  let message = 'Error in creating Tag';
  if (result.serverStatus) {
    message = 'Tag created successfully';
  }

  return {message};  
} 
async function create(tag){
    //validateCreate(tag);
    const result = await db.query(
      'INSERT INTO tags_master (tag_name, device_name,device_id,data_type,prototype,start_address,qty,device_add,dataread_type,table_name) VALUES (?, ?,?,?,?,?,?,?,?,?)', 
      [tag.tag_name, tag.device_name,tag.device_id,tag.data_type,tag.prototype,tag.start_address,tag.qty,tag.device_add,tag.dataread_type,tag.device_name]
    );
  
    let message = 'Error in creating Tag';
  
    if (result.affectedRows) {
      message = 'Tag created successfully';
      datafiled(tag);
    }
  
    return {message};
  }
  async function insert_data(query){
    //validateCreate(tag);
    const result = await db.query(query);
  
    let message = 'Error in creating Tag';
  
    if (result.affectedRows) {
      message = 'Tag created successfully';
      datafiled(tag);
    }
  
    return {message};
  }
  module.exports = {
    getMultiple,
    create,
    getRTUTags,
    datafiled,
    insert_data
  }