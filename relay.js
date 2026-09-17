// 中继回调加载器（被 relay.html 以 <script> 方式载入）
//
// 作用：把结果交回给发起请求的页面。两处细节：
//   1) GitHub Pages 会忽略查询串、原样返回本文件，因此参数只能从"当前正在执行的脚本"取；
//      用 document.currentScript 拿 src 里的 cb，而不是 location.search。
//   2) 请求来自隐藏 iframe，父窗口才是真正的讲题页，所以统一走 window.parent。
(function () {
  var src = '';
  try { src = (document.currentScript && document.currentScript.src) || ''; } catch (e) {}
  var name = '';
  try { name = new URL(src).searchParams.get('cb') || ''; } catch (e) {}
  if (!name) {
    var m = /[?&]cb=([^&]+)/.exec(src);
    if (m) name = decodeURIComponent(m[1]);
  }
  if (!name) return;

  var payload = null;
  try { payload = (window.parent.__relayPayload && window.parent.__relayPayload[name]) || null; } catch (e) {}
  var result = payload || { ok: false, reason: 'relay_error' };

  try {
    if (typeof window.parent[name] === 'function') window.parent[name](result);
  } catch (e) {}
  try {
    if (window.parent.__relayPayload) window.parent.__relayPayload[name] = null;
  } catch (e) {}
})();
