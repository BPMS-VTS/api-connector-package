/*! For license information please see screen-renderer-extend.js.LICENSE.txt */
!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=2)}({2:function(e,t,n){e.exports=n("HqmP")},"2nJ3":function(e,t,n){"use strict";n.r(t),n.d(t,"convertArrayToObject",(function(){return o})),n.d(t,"setupApiEventMapping",(function(){return c})),n.d(t,"setupApiEventMappingOld",(function(){return u}));var r=n("nbsC");function o(e){return e.reduce((function(e,t){return t.key&&(e[t.key]=t.value),e}),{})}function i(e,t,n){e.forEach((function(e,r){var o=e.config.datasource,i=o.root;o.path&&(i="".concat(o.root,".").concat(o.path),"body"===o.root&&(i="data.".concat(o.path))),_.set(t,i,n.data["".concat(e.config.name)])}))}function a(e,t,n){e.forEach((function(e,r){var o=e.config.datasource,i=o.root;o.path&&(i="".concat(o.root,".").concat(o.path)),n.data["".concat(e.config.name)]=_.get(t,i)}))}function s(e,t,n){switch(e){case"GET":var r=n.options.pagination;t.params[r.page.alias]=r.page.value>=0?r.page.value:1,t.params[r.perPage.alias]=r.perPage.value>=0?r.perPage.value:10}}function c(e,t){var n=e,o=n.config.api[0];if(void 0!==o){var c=r.render(o.request,t.data),u=JSON.parse(c);"query"===u.type&&(u.method="POST"),delete u.type,delete u.name,s(o.request.method,u,n.config),i(n.config.options.request,u,t),ProcessMaker.apiClient(u).then((function(e){a(n.config.options.response,e,t)})).catch((function(e){e.response.status&&422===e.response.status&&ProcessMaker.alert(e.response.data.error,"danger")}))}}function u(e,t){var n=e,c=n.config.api[0];if(void 0!==c){var u=c.config.options.restful,p={method:c.config.method,url:r.render(c.config.options.endpoint,t.data),params:o(u.params),auth:o(u.auth),headers:o(u.headers),data:o(u.body)};s(c.config.method,p,n.config),i(n.config.options.request,p,t),ProcessMaker.apiClient(p).then((function(e){a(n.config.options.response,e,t)})).catch((function(e){e.response.status&&422===e.response.status&&ProcessMaker.alert(e.response.data.error,"danger")}))}}},HqmP:function(e,t,n){window.ProcessMaker.EventBus.$on("screen-renderer-init",(function(e){if("task"===e.$root.$el.id){var t=n("2nJ3").setupApiEventMapping,r=["load","unload"],o=["FormHtmlDocument"];task.screen.api_config.forEach((function(n){var i=n.config.event,a=n.config.component[0];void 0!==a&&null!==i&&(r.includes(i)&&o.includes(a["editor-control"])?window.addEventListener(i,(function(){return t(n,e)}),!1):document.addEventListener("readystatechange",(function(){var r='[data-cy="screen-field-'.concat(a.config.name,'"]');document.querySelector(r).addEventListener(i,(function(r){t(n,e),r.stopPropagation()}),!1)})))}))}}))},nbsC:function(e,t,n){e.exports=function(){"use strict";var e=Object.prototype.toString,t=Array.isArray||function(t){return"[object Array]"===e.call(t)};function n(e){return"function"==typeof e}function r(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function o(e,t){return null!=e&&"object"==typeof e&&t in e}var i=RegExp.prototype.test,a=/\S/;function s(e){return!function(e,t){return i.call(e,t)}(a,e)}var c={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"},u=/\s*/,p=/\s+/,f=/\s*=/,l=/\s*\}/,h=/#|\^|\/|>|\{|&|=|!/;function d(e){this.string=e,this.tail=e,this.pos=0}function g(e,t){this.view=e,this.cache={".":this.view},this.parent=t}function v(){this.templateCache={_cache:{},set:function(e,t){this._cache[e]=t},get:function(e){return this._cache[e]},clear:function(){this._cache={}}}}d.prototype.eos=function(){return""===this.tail},d.prototype.scan=function(e){var t=this.tail.match(e);if(!t||0!==t.index)return"";var n=t[0];return this.tail=this.tail.substring(n.length),this.pos+=n.length,n},d.prototype.scanUntil=function(e){var t,n=this.tail.search(e);switch(n){case-1:t=this.tail,this.tail="";break;case 0:t="";break;default:t=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=t.length,t},g.prototype.push=function(e){return new g(e,this)},g.prototype.lookup=function(e){var t,r,i,a=this.cache;if(a.hasOwnProperty(e))t=a[e];else{for(var s,c,u,p=this,f=!1;p;){if(e.indexOf(".")>0)for(s=p.view,c=e.split("."),u=0;null!=s&&u<c.length;)u===c.length-1&&(f=o(s,c[u])||(r=s,i=c[u],null!=r&&"object"!=typeof r&&r.hasOwnProperty&&r.hasOwnProperty(i))),s=s[c[u++]];else s=p.view[e],f=o(p.view,e);if(f){t=s;break}p=p.parent}a[e]=t}return n(t)&&(t=t.call(this.view)),t},v.prototype.clearCache=function(){void 0!==this.templateCache&&this.templateCache.clear()},v.prototype.parse=function(e,n){var o=this.templateCache,i=e+":"+(n||y.tags).join(":"),a=void 0!==o,c=a?o.get(i):void 0;return null==c&&(c=function(e,n){if(!e)return[];var o,i,a,c=!1,g=[],v=[],m=[],w=!1,b=!1,k="",C=0;function E(){if(w&&!b)for(;m.length;)delete v[m.pop()];else m=[];w=!1,b=!1}function P(e){if("string"==typeof e&&(e=e.split(p,2)),!t(e)||2!==e.length)throw new Error("Invalid tags: "+e);o=new RegExp(r(e[0])+"\\s*"),i=new RegExp("\\s*"+r(e[1])),a=new RegExp("\\s*"+r("}"+e[1]))}P(n||y.tags);for(var x,j,T,O,S,_,M=new d(e);!M.eos();){if(x=M.pos,T=M.scanUntil(o))for(var U=0,q=T.length;U<q;++U)s(O=T.charAt(U))?(m.push(v.length),k+=O):(b=!0,c=!0,k+=" "),v.push(["text",O,x,x+1]),x+=1,"\n"===O&&(E(),k="",C=0,c=!1);if(!M.scan(o))break;if(w=!0,j=M.scan(h)||"name",M.scan(u),"="===j?(T=M.scanUntil(f),M.scan(f),M.scanUntil(i)):"{"===j?(T=M.scanUntil(a),M.scan(l),M.scanUntil(i),j="&"):T=M.scanUntil(i),!M.scan(i))throw new Error("Unclosed tag at "+M.pos);if(S=">"==j?[j,T,x,M.pos,k,C,c]:[j,T,x,M.pos],C++,v.push(S),"#"===j||"^"===j)g.push(S);else if("/"===j){if(!(_=g.pop()))throw new Error('Unopened section "'+T+'" at '+x);if(_[1]!==T)throw new Error('Unclosed section "'+_[1]+'" at '+x)}else"name"===j||"{"===j||"&"===j?b=!0:"="===j&&P(T)}if(E(),_=g.pop())throw new Error('Unclosed section "'+_[1]+'" at '+M.pos);return function(e){for(var t,n=[],r=n,o=[],i=0,a=e.length;i<a;++i)switch((t=e[i])[0]){case"#":case"^":r.push(t),o.push(t),r=t[4]=[];break;case"/":o.pop()[5]=t[2],r=o.length>0?o[o.length-1][4]:n;break;default:r.push(t)}return n}(function(e){for(var t,n,r=[],o=0,i=e.length;o<i;++o)(t=e[o])&&("text"===t[0]&&n&&"text"===n[0]?(n[1]+=t[1],n[3]=t[3]):(r.push(t),n=t));return r}(v))}(e,n),a&&o.set(i,c)),c},v.prototype.render=function(e,t,n,r){var o=this.getConfigTags(r),i=this.parse(e,o),a=t instanceof g?t:new g(t,void 0);return this.renderTokens(i,a,n,e,r)},v.prototype.renderTokens=function(e,t,n,r,o){for(var i,a,s,c="",u=0,p=e.length;u<p;++u)s=void 0,"#"===(a=(i=e[u])[0])?s=this.renderSection(i,t,n,r,o):"^"===a?s=this.renderInverted(i,t,n,r,o):">"===a?s=this.renderPartial(i,t,n,o):"&"===a?s=this.unescapedValue(i,t):"name"===a?s=this.escapedValue(i,t,o):"text"===a&&(s=this.rawValue(i)),void 0!==s&&(c+=s);return c},v.prototype.renderSection=function(e,r,o,i,a){var s=this,c="",u=r.lookup(e[1]);if(u){if(t(u))for(var p=0,f=u.length;p<f;++p)c+=this.renderTokens(e[4],r.push(u[p]),o,i,a);else if("object"==typeof u||"string"==typeof u||"number"==typeof u)c+=this.renderTokens(e[4],r.push(u),o,i,a);else if(n(u)){if("string"!=typeof i)throw new Error("Cannot use higher-order sections without the original template");null!=(u=u.call(r.view,i.slice(e[3],e[5]),(function(e){return s.render(e,r,o,a)})))&&(c+=u)}else c+=this.renderTokens(e[4],r,o,i,a);return c}},v.prototype.renderInverted=function(e,n,r,o,i){var a=n.lookup(e[1]);if(!a||t(a)&&0===a.length)return this.renderTokens(e[4],n,r,o,i)},v.prototype.indentPartial=function(e,t,n){for(var r=t.replace(/[^ \t]/g,""),o=e.split("\n"),i=0;i<o.length;i++)o[i].length&&(i>0||!n)&&(o[i]=r+o[i]);return o.join("\n")},v.prototype.renderPartial=function(e,t,r,o){if(r){var i=this.getConfigTags(o),a=n(r)?r(e[1]):r[e[1]];if(null!=a){var s=e[6],c=e[5],u=e[4],p=a;0==c&&u&&(p=this.indentPartial(a,u,s));var f=this.parse(p,i);return this.renderTokens(f,t,r,p,o)}}},v.prototype.unescapedValue=function(e,t){var n=t.lookup(e[1]);if(null!=n)return n},v.prototype.escapedValue=function(e,t,n){var r=this.getConfigEscape(n)||y.escape,o=t.lookup(e[1]);if(null!=o)return"number"==typeof o&&r===y.escape?String(o):r(o)},v.prototype.rawValue=function(e){return e[1]},v.prototype.getConfigTags=function(e){return t(e)?e:e&&"object"==typeof e?e.tags:void 0},v.prototype.getConfigEscape=function(e){return e&&"object"==typeof e&&!t(e)?e.escape:void 0};var y={name:"mustache.js",version:"4.2.0",tags:["{{","}}"],clearCache:void 0,escape:void 0,parse:void 0,render:void 0,Scanner:void 0,Context:void 0,Writer:void 0,set templateCache(e){m.templateCache=e},get templateCache(){return m.templateCache}},m=new v;return y.clearCache=function(){return m.clearCache()},y.parse=function(e,t){return m.parse(e,t)},y.render=function(e,n,r,o){if("string"!=typeof e)throw new TypeError('Invalid template! Template should be a "string" but "'+(t(i=e)?"array":typeof i)+'" was given as the first argument for mustache#render(template, view, partials)');var i;return m.render(e,n,r,o)},y.escape=function(e){return String(e).replace(/[&<>"'`=\/]/g,(function(e){return c[e]}))},y.Scanner=d,y.Context=g,y.Writer=v,y}()}});