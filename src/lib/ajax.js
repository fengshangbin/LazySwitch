export default function ajax() {
  var ajaxData = {
    type: arguments[0].type || 'GET',
    url: arguments[0].url || '',
    async: arguments[0].async || 'true',
    data: arguments[0].data || null,
    dataType: arguments[0].dataType || 'text',
    header: arguments[0].header || null,
    contentType: arguments[0].contentType || 'application/x-www-form-urlencoded',
    beforeSend: arguments[0].beforeSend || function() {},
    success: arguments[0].success || function() {},
    error: arguments[0].error || function() {}
  };
  ajaxData.beforeSend();
  var xhr = createxmlHttpRequest();
  //xhr.responseType = ajaxData.dataType;
  //ajaxData.data = convertData(ajaxData.data);
  if (ajaxData.type.toLowerCase() == 'get' && ajaxData.data != null && ajaxData.data != '') {
    ajaxData.url += ajaxData.url.indexOf('?') > 0 ? '&' : '?';
    ajaxData.url += ajaxData.data;
  }
  xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
  xhr.setRequestHeader('Content-Type', ajaxData.contentType);
  if (ajaxData.header != null) {
    for (var key in ajaxData.header) {
      xhr.setRequestHeader(key, ajaxData.header[key]);
    }
  }
  xhr.send(ajaxData.type.toLowerCase() == 'post' && ajaxData.data != null ? ajaxData.data : null);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        ajaxData.success(xhr.responseText);
      } else {
        ajaxData.error(xhr.status);
      }
    }
  };
}

function createxmlHttpRequest() {
  /* if (window.ActiveXObject) {
    return new ActiveXObject('Microsoft.XMLHTTP');
  } else if (window.XMLHttpRequest) { */
  return new XMLHttpRequest();
  //}
}

/*function convertData(data){ 
  if( typeof data === 'object' ){ 
	let str = []
	for (let key in data) {
	  str.push(key + '=' + data[key])
	}
	return str.join('&');
  }else{ 
    return data; 
  } 
}*/
