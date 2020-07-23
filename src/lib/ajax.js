export default function ajax() {
  var ajaxData = {
    url: arguments[0].url || '',
    success: arguments[0].success || function () { },
    error: arguments[0].error || function () { }
  };
  var request = new XMLHttpRequest();
  request.addEventListener('load', function () {
    ajaxData.success(this.responseText);
  });
  request.addEventListener('error', function () {
    ajaxData.error('error at request ' + ajaxData.url);
  });
  request.open('GET', ajaxData.url);
  request.send();
}
