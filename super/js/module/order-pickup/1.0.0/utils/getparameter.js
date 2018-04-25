/**
 * @name: getparameter;
 * @author: huangzhengqian;
 * @date: 2017-11-1;
 * 获取Url上的query参数值;
 *
 *  <code><pre>
 *  var url = '?foo=foo1&bar=bar1
 *  getParameterByName('foo', url)  // foo1
 * </pre></code>
 */
define(function(require, exports, module) {
    return function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
});