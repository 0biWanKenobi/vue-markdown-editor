(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{141:function(t,e,n){"use strict";var r=n(43),o=n(15),i=n(104),c=n(102),u=n(14),a=n(62),s=n(103);t.exports=function(t){var e,n,f,l,d,h,v=o(t),p="function"==typeof this?this:Array,x=arguments.length,m=x>1?arguments[1]:void 0,b=void 0!==m,g=s(v),k=0;if(b&&(m=r(m,x>2?arguments[2]:void 0,2)),null==g||p==Array&&c(g))for(n=new p(e=u(v.length));e>k;k++)h=b?m(v[k],k):v[k],a(n,k,h);else for(d=(l=g.call(v)).next,n=new p;!(f=d.call(l)).done;k++)h=b?i(l,m,[f.value,k],!0):f.value,a(n,k,h);return n.length=k,n}},142:function(t,e,n){"use strict";var r=n(99),o=n(41).getWeakData,i=n(9),c=n(5),u=n(65),a=n(64),s=n(20),f=n(6),l=n(19),d=l.set,h=l.getterFor,v=s.find,p=s.findIndex,x=0,m=function(t){return t.frozen||(t.frozen=new b)},b=function(){this.entries=[]},g=function(t,e){return v(t.entries,(function(t){return t[0]===e}))};b.prototype={get:function(t){var e=g(this,t);if(e)return e[1]},has:function(t){return!!g(this,t)},set:function(t,e){var n=g(this,t);n?n[1]=e:this.entries.push([t,e])},delete:function(t){var e=p(this.entries,(function(e){return e[0]===t}));return~e&&this.entries.splice(e,1),!!~e}},t.exports={getConstructor:function(t,e,n,s){var l=t((function(t,r){u(t,l,e),d(t,{type:e,id:x++,frozen:void 0}),null!=r&&a(r,t[s],t,n)})),v=h(e),p=function(t,e,n){var r=v(t),c=o(i(e),!0);return!0===c?m(r).set(e,n):c[r.id]=n,t};return r(l.prototype,{delete:function(t){var e=v(this);if(!c(t))return!1;var n=o(t);return!0===n?m(e).delete(t):n&&f(n,e.id)&&delete n[e.id]},has:function(t){var e=v(this);if(!c(t))return!1;var n=o(t);return!0===n?m(e).has(t):n&&f(n,e.id)}}),r(l.prototype,n?{get:function(t){var e=v(this);if(c(t)){var n=o(t);return!0===n?m(e).get(t):n?n[e.id]:void 0}},set:function(t,e){return p(this,t,e)}}:{add:function(t){return p(this,t,!0)}}),l}}},146:function(t,e){t.exports=function(t){return t&&t.__esModule?t:{default:t}}},147:function(t,e,n){var r=n(1),o=n(141);r({target:"Array",stat:!0,forced:!n(105)((function(t){Array.from(t)}))},{from:o})},148:function(t,e,n){n(97)("asyncIterator")},149:function(t,e,n){n(97)("iterator")},150:function(t,e,n){"use strict";var r=n(98),o=n(106);t.exports=r("Map",(function(t){return function(){return t(this,arguments.length?arguments[0]:void 0)}}),o)},151:function(t,e,n){n(1)({target:"Object",stat:!0},{setPrototypeOf:n(63)})},152:function(t,e,n){"use strict";var r,o=n(4),i=n(99),c=n(41),u=n(98),a=n(142),s=n(5),f=n(19).enforce,l=n(100),d=!o.ActiveXObject&&"ActiveXObject"in o,h=Object.isExtensible,v=function(t){return function(){return t(this,arguments.length?arguments[0]:void 0)}},p=t.exports=u("WeakMap",v,a);if(l&&d){r=a.getConstructor(v,"WeakMap",!0),c.REQUIRED=!0;var x=p.prototype,m=x.delete,b=x.has,g=x.get,k=x.set;i(x,{delete:function(t){if(s(t)&&!h(t)){var e=f(this);return e.frozen||(e.frozen=new r),m.call(this,t)||e.frozen.delete(t)}return m.call(this,t)},has:function(t){if(s(t)&&!h(t)){var e=f(this);return e.frozen||(e.frozen=new r),b.call(this,t)||e.frozen.has(t)}return b.call(this,t)},get:function(t){if(s(t)&&!h(t)){var e=f(this);return e.frozen||(e.frozen=new r),b.call(this,t)?g.call(this,t):e.frozen.get(t)}return g.call(this,t)},set:function(t,e){if(s(t)&&!h(t)){var n=f(this);n.frozen||(n.frozen=new r),b.call(this,t)?k.call(this,t,e):n.frozen.set(t,e)}else k.call(this,t,e);return this}})}},154:function(t,e,n){var r=n(1),o=n(3),i=n(101).f;r({target:"Object",stat:!0,forced:o((function(){return!Object.getOwnPropertyNames(1)}))},{getOwnPropertyNames:i})},155:function(t,e,n){var r=n(1),o=n(3),i=n(5),c=Object.isFrozen;r({target:"Object",stat:!0,forced:o((function(){c(1)}))},{isFrozen:function(t){return!i(t)||!!c&&c(t)}})},205:function(t,e,n){"use strict";n(67),n(107),n(156),n(42),n(66),n(11),n(29),n(159),n(44),n(157),n(68),n(45),e.__esModule=!0,e.arraytoObject=function(t){for(var e={},n=0;n<t.length;n++)t[n]&&o(e,t[n]);return e},e.importAll=function(t,e){e.keys().forEach((function(n){t[n]=e(n)}))},e.generatorText=function(t){var e,n,r=t.selected,o=t.InsertGetter,i=t.selectedGetter,c=void 0===i?function(t){return t}:i,u=t.ignoreEmptyLine,a=void 0===u||u;r?(n=c(r),e=o(r,1),-1!==r.indexOf("\n")&&(e=r.split("\n").map((function(t,e){return a&&!t?"":o(t,e+1).replace(c(null),"")})).join("\n"),n=e)):(e=o(null,1),n=c(r));return{insertContent:e,newSelected:n}},e.isObject=void 0;var r=Object.prototype.toString;function o(t,e){return Object.keys(e).forEach((function(n){t[n]=e[n]})),t}e.isObject=function(t){return"[object Object]"===r.call(t)}},322:function(t,e,n){"use strict";var r=n(146);e.__esModule=!0,e.default=function(t){var e=void 0===t?{}:t,n=e.name,r=void 0===n?"todo-list":n,u=e.icon,a=void 0===u?"v-md-icon-checkbox":u,s=e.text,f=e.color,l=void 0===f?"#3eaf7c":f,d=(0,o.default)({commandName:r,title:function(t){return t.langConfig.task.toolbar+"（Ctrl+Shift+U）"},text:s,icon:a}),h=function(t){return"border-color: "+("todo"===t?"#d9d9d9":l)},v="background-color: "+l,p=function(t){t&&t.use(c.default,{renderCheckbox:function(t){return'<span class="v-md-editor__todo-list-checkbox'+("todo"===t?"":" v-md-editor__todo-list-checkbox--checked")+'" style="'+("todo"===t?""+h(t):h(t)+";"+v)+'"></span>'}})};return{install:function(t){"v-md-editor"===t.name&&(t.command(r,i.default),t.toolbar(r,d),t.hotkey({modifier:"ctrlShift",key:"u",action:function(t){t.execCommand(r)}}),t.lang.add({"zh-CN":{task:{toolbar:"任务列表",placeholder:"任务列表"}},"en-US":{task:{toolbar:"Task",placeholder:"Task"}}})),t.extendMarkdown(p)}}};var o=r(n(323)),i=r(n(324)),c=r(n(325));n(326)},323:function(t,e,n){"use strict";e.__esModule=!0,e.default=function(t){var e=t.commandName,n=t.text,r=t.title,o=t.icon;return{title:r,icon:o,text:n,action:function(t){t.execCommand(e,{type:"todo"})}}}},324:function(t,e,n){"use strict";e.__esModule=!0,e.default=function(t,e){var n=(void 0===e?{}:e).type,o=void 0===n?"todo":n;t.insert((function(e){var n=t.langConfig.task.placeholder,i="todo"===o?" ":"x",c=function(t){return t||n},u=(0,r.generatorText)({selected:e,InsertGetter:function(t){return"- ["+i+"] "+c(t)},selectedGetter:c});return{text:u.insertContent,selected:u.newSelected}}))};var r=n(205)},325:function(t,e,n){"use strict";n(107),n(30),t.exports=function(t,e){void 0===e&&(e={});var n=e,r=n.listClass,o=void 0===r?"v-md-editor__todo-list":r,i=n.listItemClass,c=void 0===i?"v-md-editor__todo-list-item":i,u=n.renderCheckbox,a=void 0===u?function(t){return'<input class="v-md-editor__todo-list-checkbox" type="checkbox" '+("todo"===t?"":"checked")+">"}:u;function s(t,e,n){var r=t.attrIndex(e),o=[e,n];r<0?t.attrPush(o):t.attrs[r]=o}function f(t,e){for(var n=t[e].level-1,r=e-1;r>=0;r--)if(t[r].level===n)return r;return-1}function l(t,e){return"inline"===t[e].type&&function(t){return"paragraph_open"===t.type}(t[e-1])&&function(t){return"list_item_open"===t.type}(t[e-2])&&function(t){return 0===t.content.indexOf("[ ] ")||0===t.content.indexOf("[x] ")||0===t.content.indexOf("[X] ")}(t[e])}function d(t,e){t.children.unshift(function(t,e){var n=new e("html_inline","",0);0===t.content.indexOf("[ ] ")?n.content=a("todo"):0!==t.content.indexOf("[x] ")&&0!==t.content.indexOf("[X] ")||(n.content=a("completed"));return n}(t,e)),t.children[1].content=t.children[1].content.slice(3),t.content=t.content.slice(3)}t.core.ruler.after("inline","v-md-task-lists",(function(t){for(var e=t.tokens,n=2;n<e.length;n++)l(e,n)&&(d(e[n],t.Token),s(e[n-2],"class",c),s(e[f(e,n-2)],"class",o))}))}},326:function(t,e,n){},349:function(t,e,n){"use strict";n.r(e);var r=n(143),o=n(144),i=n.n(o),c=(n(145),n(153)),u=n.n(c),a=n(322),s=n.n(a);i.a.use(s()());var f={components:Object(r.a)({},i.a.name,i.a),data:function(){return this.theme=u.a,{text:"- [x] Task"}}},l=n(28),d=Object(l.a)(f,(function(){var t=this,e=t.$createElement;return(t._self._c||e)("v-md-editor",{attrs:{"left-toolbar":"undo redo | todo-list",theme:t.theme,height:"500px"},model:{value:t.text,callback:function(e){t.text=e},expression:"text"}})}),[],!1,null,null,null);e.default=d.exports}}]);