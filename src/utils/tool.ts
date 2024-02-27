
/**生成唯一ID */
let _idCounter = 0;
export function generateUniqueID() {
  var ts = new Date().getTime().toString();
  var parts = ts.split("").reverse();
  var id = "";
  for (var i = 0; i < 5; ++i) {
    var index = Math.floor(Math.random() * parts.length);
    id += parts[index];
  }
  id += (++_idCounter);
  return id;
}
