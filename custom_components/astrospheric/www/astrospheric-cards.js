!function(){"use strict";function t(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const r=t=>new o("string"==typeof t?t:t+"",void 0,s),a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},l=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return r(e)})(t):t,{is:c,defineProperty:h,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:g,getPrototypeOf:u}=Object,f=globalThis,_=f.trustedTypes,m=_?_.emptyScript:"",y=f.reactiveElementPolyfillSupport,$=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!c(t,e),x={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);n?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...p(t),...g(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const o=n.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const o=this.constructor;if(!1===s&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??v)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[$("elementProperties")]=new Map,w[$("finalized")]=new Map,y?.({ReactiveElement:w}),(f.reactiveElementVersions??=[]).push("2.1.2");const A=globalThis,S=t=>t,E=A.trustedTypes,k=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+M,T=`<${P}>`,N=document,z=()=>N.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,D=Array.isArray,R="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,F=/>/g,B=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,j=/"/g,L=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),G=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),V=new WeakMap,J=N.createTreeWalker(N,129);function Z(t,e){if(!D(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":3===e?"<math>":"",r=U;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(r.lastIndex=h,l=r.exec(i),null!==l);)h=r.lastIndex,r===U?"!--"===l[1]?r=H:void 0!==l[1]?r=F:void 0!==l[2]?(L.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=B):void 0!==l[3]&&(r=B):r===B?">"===l[0]?(r=n??U,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?B:'"'===l[3]?j:I):r===j||r===I?r=B:r===H||r===F?r=U:(r=B,n=void 0);const d=r===B&&t[e+1].startsWith("/>")?" ":"";o+=r===U?i+T:c>=0?(s.push(a),i.slice(0,c)+C+i.slice(c)+M+d):i+M+(-2===c?e:d)}return[Z(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Q{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[l,c]=K(t,e);if(this.el=Q.createElement(l,i),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=J.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=c[o++],i=s.getAttribute(t).split(M),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?it:"?"===r[1]?st:"@"===r[1]?nt:et}),s.removeAttribute(t)}else t.startsWith(M)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(M),e=t.length-1;if(e>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],z()),J.nextNode(),a.push({type:2,index:++n});s.append(t[e],z())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(M,t+1));)a.push({type:7,index:n}),t+=M.length-1}n++}}static createElement(t,e){const i=N.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,s){if(e===G)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=O(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=X(t,n._$AS(t,e.values),n,s)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??N).importNode(e,!0);J.currentNode=s;let n=J.nextNode(),o=0,r=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new tt(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new ot(n,this,t)),this._$AV.push(e),a=i[++r]}o!==a?.index&&(n=J.nextNode(),o++)}return J.currentNode=N,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),O(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>D(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(N.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Q.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Y(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new Q(t)),e}k(t){D(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new tt(this.O(z()),this.O(z()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=X(this,t,e,0),o=!O(t)||t!==this._$AH&&t!==G,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=X(this,s[i+r],e,r),a===G&&(a=this._$AH[r]),o||=!O(a)||a!==this._$AH[r],a===q?t=q:t!==q&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class nt extends et{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??q)===G)return;const i=this._$AH,s=t===q&&i!==q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const rt=A.litHtmlPolyfillSupport;rt?.(Q,tt),(A.litHtmlVersions??=[]).push("3.3.2");const at=globalThis;class lt extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new tt(e.insertBefore(z(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const ct=at.litElementPolyfillSupport;ct?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.2");const ht={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:v},dt=(t=ht,e,i)=>{const{kind:s,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function pt(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function gt(t){return pt({...t,state:!0,attribute:!1})}const ut="#0B1026",ft="#E8E6E3",_t="#8B8FA3",mt="#5C6078",yt="#00C853",$t="#64DD17",bt="#FFD600",vt="#FF9100",xt="#FF1744",wt="#FFF8E1",At="#FFD54F",St="rgba(255, 213, 79, 0.3)",Et={Mercury:"#B0BEC5",Venus:"#FFF59D",Mars:"#E57373",Jupiter:"#FFB74D",Saturn:"#FFE082",Uranus:"#80DEEA",Neptune:"#64B5F6"};function kt(t){return t>=.8?yt:t>=.6?$t:t>=.4?bt:t>=.2?vt:xt}function Ct(t){return kt(t/5)}function Mt(t){return kt(Math.max(0,1-t/27))}function Pt(t){return kt(Math.max(0,1-t/100))}const Tt={0:"Cloudy",1:"Poor",2:"Below Avg",3:"Average",4:"Above Avg",5:"Excellent"},Nt=[[5,"Excellent"],[9,"Above Avg"],[13,"Average"],[23,"Below Avg"],[27,"Poor"]];const zt=2*Math.PI*40;class Ot extends lt{setConfig(t){this._config=t}getCardSize(){return 4}static getStubConfig(){return{type:"custom:astrospheric-conditions-card",cloud_cover_entity:"",seeing_entity:"",transparency_entity:"",temperature_entity:"",dew_point_entity:"",wind_speed_entity:"",wind_direction_entity:""}}static getConfigElement(){return document.createElement("astrospheric-conditions-editor")}_getState(t){if(t&&this.hass)return this.hass.states[t]?.state}_getAttr(t,e){if(t&&this.hass)return this.hass.states[t]?.attributes[e]}_renderRingGauge(t,e,i,s){const n=Math.max(0,Math.min(1,e));return W`
      <div class="ring-gauge">
        <div class="ring-wrap">
          <svg viewBox="0 0 100 100">
            <circle class="track" cx="50" cy="50" r="${40}" />
            <circle class="fill" cx="50" cy="50" r="${40}"
              style="stroke: ${s}; stroke-dashoffset: ${zt*(1-n)}; filter: drop-shadow(0 0 6px ${s}60)" />
          </svg>
          <div class="ring-center">
            <span class="ring-value" style="color: ${s}">${i}</span>
          </div>
        </div>
        <span class="ring-name">${t}</span>
      </div>
    `}render(){if(!this._config||!this.hass)return q;const t=Number(this._getState(this._config.seeing_entity))||0,e=Number(this._getState(this._config.transparency_entity))||0,i=Number(this._getState(this._config.cloud_cover_entity))||0,s=this._getState(this._config.temperature_entity),n=this._getState(this._config.dew_point_entity),o=this._getState(this._config.wind_speed_entity),r=this._getAttr(this._config.wind_direction_entity,"cardinal")||"",a=Tt[Math.round(t)]||"Unknown",l=function(t){for(const[e,i]of Nt)if(t<=e)return i;return"Cloudy"}(e);return W`
      <ha-card>
        <div class="header">
          <span class="title">${this._config.title||"Sky Conditions"}</span>
        </div>
        <div class="content">
          <div class="gauges">
            ${this._renderRingGauge("Seeing",t/5,a,Ct(t))}
            ${this._renderRingGauge("Transparency",Math.max(0,1-e/27),l,Mt(e))}
            ${this._renderRingGauge("Cloud Cover",Math.max(0,1-i/100),`${i}%`,Pt(i))}
          </div>
          <div class="weather-row">
            ${void 0!==s?W`
              <div class="weather-chip">
                <ha-icon icon="mdi:thermometer"></ha-icon>
                <span>${s}&deg;</span>
              </div>
            `:q}
            ${void 0!==n?W`
              <div class="weather-chip">
                <ha-icon icon="mdi:water-outline"></ha-icon>
                <span>${n}&deg;</span>
              </div>
            `:q}
            ${void 0!==o?W`
              <div class="weather-chip">
                <ha-icon icon="mdi:weather-windy"></ha-icon>
                <span>${o} ${r}</span>
              </div>
            `:q}
          </div>
        </div>
      </ha-card>
    `}}function Dt(t,e,i){const s=(90-Math.max(0,t))/90*i,n=(e-90)*Math.PI/180;return[s*Math.cos(n),s*Math.sin(n)]}function Rt(t){const e=Math.max(-1.5,Math.min(5.5,t));return Math.max(.5,4-.5*(e+1.5))}Ot.styles=a`
    :host { display: block; }
    ha-card {
      background: linear-gradient(145deg, rgba(26, 32, 64, 0.92) 0%, rgba(11, 16, 38, 0.97) 100%);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04);
      color: ${r(ft)};
      padding: 20px;
      border-radius: var(--ha-card-border-radius, 16px);
      overflow: hidden;
    }
    .header { padding-bottom: 16px; }
    .title { font-size: 1.1em; font-weight: 600; letter-spacing: 0.3px; }
    .content { display: flex; flex-direction: column; gap: 20px; }
    .gauges { display: flex; justify-content: space-around; }
    .ring-gauge {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
    }
    .ring-wrap {
      position: relative; width: 100px; height: 100px;
    }
    .ring-wrap svg {
      width: 100%; height: 100%; transform: rotate(-90deg);
    }
    .track {
      fill: none; stroke: rgba(255, 255, 255, 0.06); stroke-width: 7;
    }
    .fill {
      fill: none; stroke-width: 7; stroke-linecap: round;
      stroke-dasharray: ${r(zt.toFixed(1))};
      transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.6s ease;
    }
    .ring-center {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .ring-value {
      font-size: 0.82em; font-weight: 700; text-align: center; line-height: 1.2;
    }
    .ring-name {
      font-size: 0.72em; text-transform: uppercase; letter-spacing: 0.6px;
      color: ${r(_t)};
    }
    .weather-row {
      display: flex; justify-content: center; gap: 10px;
      padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .weather-chip {
      display: flex; align-items: center; gap: 5px;
      font-size: 0.82em; color: ${r(_t)};
      background: rgba(255, 255, 255, 0.04); padding: 5px 12px;
      border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .weather-chip ha-icon { --mdc-icon-size: 16px; }
  `,t([pt({attribute:!1})],Ot.prototype,"hass",void 0),t([gt()],Ot.prototype,"_config",void 0),customElements.define("astrospheric-conditions-card",Ot);const Ut=2*Math.PI*82;class Ht extends lt{setConfig(t){this._config=t}getCardSize(){return 5}static getStubConfig(){return{type:"custom:astrospheric-moon-card",moon_phase_entity:"",moon_illumination_entity:"",moon_altitude_entity:"",moon_azimuth_entity:""}}static getConfigElement(){return document.createElement("astrospheric-moon-editor")}_getState(t){if(t&&this.hass)return this.hass.states[t]?.state}_getAttr(t,e){if(t&&this.hass)return this.hass.states[t]?.attributes[e]}render(){if(!this._config||!this.hass)return q;const t=this._getState(this._config.moon_phase_entity)||"Unknown",e=Number(this._getAttr(this._config.moon_phase_entity,"phase_value"))||0,i=Number(this._getState(this._config.moon_illumination_entity))||0,s=Number(this._getState(this._config.moon_altitude_entity))||0,n=Number(this._getState(this._config.moon_azimuth_entity))||0,o=function(t,e,i){const s=i/2,n=i/2,o=i/2-2,r=`\n    <defs>\n      <radialGradient id="ml-lit" cx="40%" cy="35%" r="60%">\n        <stop offset="0%" stop-color="#FFFDE7"/>\n        <stop offset="100%" stop-color="${wt}"/>\n      </radialGradient>\n      <radialGradient id="ml-dark" cx="50%" cy="50%" r="50%">\n        <stop offset="0%" stop-color="#3A3D45"/>\n        <stop offset="100%" stop-color="#2A2D35"/>\n      </radialGradient>\n      <filter id="ml-glow">\n        <feGaussianBlur stdDeviation="1.5" result="b"/>\n        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>\n      </filter>\n    </defs>`,a=`<circle cx="${s}" cy="${n}" r="${o}" fill="url(#ml-dark)"/>`,l=`<circle cx="${s}" cy="${n}" r="${o}" fill="rgba(160,180,220,0.04)"/>`,c=e/100;if(c<.01)return`<svg viewBox="0 0 ${i} ${i}" width="${i}" height="${i}">\n      ${r}${a}\n      <circle cx="${s}" cy="${n}" r="${o}" fill="none" stroke="rgba(160,180,220,0.12)" stroke-width="0.5"/>\n    </svg>`;if(c>.99)return`<svg viewBox="0 0 ${i} ${i}" width="${i}" height="${i}">\n      ${r}\n      <circle cx="${s}" cy="${n}" r="${o}" fill="url(#ml-lit)" filter="url(#ml-glow)"/>\n    </svg>`;const h=t<.5,d=Math.cos(2*t*Math.PI)*o;return`<svg viewBox="0 0 ${i} ${i}" width="${i}" height="${i}">\n    ${r}${a}${l}\n    <path d="\n    M ${s} ${n-o}\n    A ${o} ${o} 0 0 ${h?1:0} ${s} ${n+o}\n    A ${Math.abs(d)} ${o} 0 0 ${d>0?1:0} ${s} ${n-o}\n    Z\n  " fill="url(#ml-lit)" filter="url(#ml-glow)"/>\n  </svg>`}(e,i,150),r=s<0,a=(l=n,["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"][Math.round((l%360+360)%360/22.5)%16]);var l;const c=Ut*(1-i/100),h=i>50?"0.2":"0.12";return W`
      <ha-card>
        <div class="header">
          <span class="title">${this._config.title||"Moon"}</span>
        </div>
        <div class="content">
          <div class="moon-container">
            <svg class="ill-ring" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="${82}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="3" />
              <circle cx="90" cy="90" r="${82}" fill="none"
                stroke="${wt}" stroke-width="3" stroke-linecap="round"
                stroke-dasharray="${Ut}" stroke-dashoffset="${c}"
                style="filter: drop-shadow(0 0 4px rgba(255,248,225,0.4)); transition: stroke-dashoffset 1s ease" />
            </svg>
            <div class="moon-visual" style="filter: drop-shadow(0 0 20px rgba(255,248,225,${h}))" .innerHTML=${o}></div>
          </div>
          <div class="phase-name">${t}</div>
          <div class="illumination">${i.toFixed(1)}% illuminated</div>
          <div class="position-grid">
            <div class="pos-item">
              <ha-icon icon="${r?"mdi:arrow-down":"mdi:arrow-up"}"
                style="--mdc-icon-size: 16px; color: ${r?vt:yt}"></ha-icon>
              <div class="pos-data">
                <span class="pos-value ${r?"below":""}">${s.toFixed(1)}&deg;</span>
                <span class="pos-label">${r?"Below horizon":"Altitude"}</span>
              </div>
            </div>
            <div class="pos-item">
              <ha-icon icon="mdi:compass-outline"
                style="--mdc-icon-size: 16px; color: ${_t}"></ha-icon>
              <div class="pos-data">
                <span class="pos-value">${n.toFixed(1)}&deg; ${a}</span>
                <span class="pos-label">Azimuth</span>
              </div>
            </div>
          </div>
        </div>
      </ha-card>
    `}}Ht.styles=a`
    :host { display: block; }
    ha-card {
      background: linear-gradient(145deg, rgba(26, 32, 64, 0.92) 0%, rgba(11, 16, 38, 0.97) 100%);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04);
      color: ${r(ft)};
      padding: 20px;
      border-radius: var(--ha-card-border-radius, 16px);
      overflow: hidden;
    }
    .header { padding-bottom: 12px; }
    .title { font-size: 1.1em; font-weight: 600; letter-spacing: 0.3px; }
    .content {
      display: flex; flex-direction: column; align-items: center; gap: 10px;
    }
    .moon-container {
      position: relative; width: 180px; height: 180px;
      display: flex; align-items: center; justify-content: center;
    }
    .ill-ring {
      position: absolute; inset: 0; width: 100%; height: 100%;
      transform: rotate(-90deg);
    }
    .moon-visual { z-index: 1; }
    .moon-visual svg { display: block; }
    .phase-name {
      font-size: 1.3em; font-weight: 600;
      color: ${r(wt)};
    }
    .illumination {
      font-size: 0.9em; color: ${r(_t)};
    }
    .position-grid {
      display: flex; gap: 28px; margin-top: 12px; padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      width: 100%; justify-content: center;
    }
    .pos-item { display: flex; align-items: center; gap: 8px; }
    .pos-data { display: flex; flex-direction: column; }
    .pos-value { font-size: 1em; font-weight: 600; }
    .pos-value.below { color: ${r(vt)}; }
    .pos-label {
      font-size: 0.7em; color: ${r(mt)};
      text-transform: uppercase; letter-spacing: 0.3px;
    }
  `,t([pt({attribute:!1})],Ht.prototype,"hass",void 0),t([gt()],Ht.prototype,"_config",void 0),customElements.define("astrospheric-moon-card",Ht);class Ft extends lt{setConfig(t){this._config=t}getCardSize(){return 6}static getStubConfig(){return{type:"custom:astrospheric-sky-map-card",sun_altitude_entity:"",sun_azimuth_entity:"",moon_altitude_entity:"",moon_azimuth_entity:"",visible_planets_entity:""}}_getState(t){if(t&&this.hass)return this.hass.states[t]?.state}_getAttr(t,e){if(t&&this.hass)return this.hass.states[t]?.attributes[e]}firstUpdated(){this._canvas=this.shadowRoot?.querySelector("canvas"),this._drawSkyMap()}updated(){this._drawSkyMap()}_drawSkyMap(){if(!this._canvas||!this.hass||!this._config)return;const t=this._canvas,e=t.width,i=t.getContext("2d");if(!i)return;const s=e/2,n=e/2,o=e/2-30;i.clearRect(0,0,e,e),i.fillStyle=ut,i.beginPath(),i.arc(s,n,o+20,0,2*Math.PI),i.fill(),i.strokeStyle="rgba(255, 255, 255, 0.08)",i.lineWidth=1;for(const t of[30,60]){const e=(90-t)/90*o;i.beginPath(),i.arc(s,n,e,0,2*Math.PI),i.stroke()}i.strokeStyle="rgba(255, 255, 255, 0.2)",i.lineWidth=1.5,i.beginPath(),i.arc(s,n,o,0,2*Math.PI),i.stroke(),i.fillStyle=_t,i.font="12px sans-serif",i.textAlign="center",i.textBaseline="middle";const r=[{label:"N",angle:-Math.PI/2},{label:"E",angle:0},{label:"S",angle:Math.PI/2},{label:"W",angle:Math.PI}];for(const t of r){const e=s+(o+15)*Math.cos(t.angle),r=n+(o+15)*Math.sin(t.angle);i.fillText(t.label,e,r)}i.strokeStyle="rgba(255, 255, 255, 0.04)",i.lineWidth=.5,i.beginPath(),i.moveTo(s-o,n),i.lineTo(s+o,n),i.moveTo(s,n-o),i.lineTo(s,n+o),i.stroke();const a=Number(this._getState(this._config.sun_altitude_entity))||0,l=Number(this._getState(this._config.sun_azimuth_entity))||0;if(a>0){const[t,e]=Dt(a,l,o),r=i.createRadialGradient(s+t,n+e,0,s+t,n+e,12);r.addColorStop(0,St),r.addColorStop(1,"transparent"),i.fillStyle=r,i.beginPath(),i.arc(s+t,n+e,12,0,2*Math.PI),i.fill(),i.fillStyle=At,i.beginPath(),i.arc(s+t,n+e,5,0,2*Math.PI),i.fill(),i.fillStyle=At,i.font="10px sans-serif",i.fillText("Sun",s+t,n+e-10)}const c=Number(this._getState(this._config.moon_altitude_entity))||0,h=Number(this._getState(this._config.moon_azimuth_entity))||0;if(c>0){const[t,e]=Dt(c,h,o);i.fillStyle=wt,i.beginPath(),i.arc(s+t,n+e,5,0,2*Math.PI),i.fill(),i.font="10px sans-serif",i.fillText("Moon",s+t,n+e-10)}const d=this._getAttr(this._config.visible_planets_entity,"planets"),p=Array.isArray(d)?d:[];for(const t of p){if(!t||t.altitude<=0)continue;const[e,r]=Dt(t.altitude,t.azimuth,o),a=Et[t.name]||ft,l=Rt(t.magnitude);i.fillStyle=a,i.beginPath(),i.arc(s+e,n+r,Math.max(l,2.5),0,2*Math.PI),i.fill(),i.font="9px sans-serif",i.fillStyle=a,i.fillText(t.name,s+e,n+r-8)}i.fillStyle="rgba(255, 255, 255, 0.15)",i.beginPath(),i.arc(s,n,2,0,2*Math.PI),i.fill()}render(){return this._config&&this.hass?W`
      <ha-card>
        <div class="card-header">
          <span class="title">${this._config.title||"Sky Map"}</span>
        </div>
        <div class="card-content">
          <canvas width="300" height="300"></canvas>
        </div>
      </ha-card>
    `:q}}Ft.styles=a`
    :host { display: block; }
    ha-card {
      background: linear-gradient(145deg, rgba(26, 32, 64, 0.92) 0%, rgba(11, 16, 38, 0.97) 100%);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04);
      color: var(--primary-text-color, #E8E6E3);
      padding: 20px;
      border-radius: var(--ha-card-border-radius, 16px);
      overflow: hidden;
    }
    .card-header { padding-bottom: 8px; }
    .title { font-size: 1.1em; font-weight: 600; letter-spacing: 0.3px; }
    .card-content { display: flex; justify-content: center; }
    canvas { max-width: 100%; height: auto; }
  `,t([pt({attribute:!1})],Ft.prototype,"hass",void 0),t([gt()],Ft.prototype,"_config",void 0),customElements.define("astrospheric-sky-map-card",Ft);class Bt extends lt{setConfig(t){this._config=t}getCardSize(){return 5}static getStubConfig(){return{type:"custom:astrospheric-forecast-card",cloud_cover_entity:"",seeing_entity:"",transparency_entity:""}}disconnectedCallback(){super.disconnectedCallback(),this._resizeObs?.disconnect()}_getForecastData(t){if(!t||!this.hass)return[];const e=this.hass.states[t];if(!e)return[];const i=e.attributes.forecast;return Array.isArray(i)?i:[]}firstUpdated(){const t=this.shadowRoot?.querySelector(".chart-wrap");t&&(this._resizeObs=new ResizeObserver(()=>this._drawChart()),this._resizeObs.observe(t),this._drawChart())}updated(){this._drawChart()}_drawChart(){const t=this.shadowRoot?.querySelector("canvas");if(!t||!this._config)return;const e=t.parentElement,i=window.devicePixelRatio||1,s=e.clientWidth;if(0===s)return;const n=200;t.width=s*i,t.height=n*i,t.style.width=`${s}px`,t.style.height="200px";const o=t.getContext("2d");if(!o)return;o.scale(i,i),o.clearRect(0,0,s,n);const r=this._getForecastData(this._config.cloud_cover_entity),a=this._getForecastData(this._config.seeing_entity),l=this._getForecastData(this._config.transparency_entity),c=r.length>0?r:a.length>0?a:l;if(0===c.length)return o.fillStyle=mt,o.font="13px sans-serif",o.textAlign="center",void o.fillText("No forecast data available",s/2,100);const h=16,d=12,p=38,g=s-p-d,u=n-h-28,f=c.map(t=>new Date(t.datetime).getTime()),_=f[0],m=f[f.length-1],y=m-_||1,$=t=>p+(t-_)/y*g,b=(t,e)=>h+u-Math.max(0,Math.min(e,t))/e*u;for(let t=0;t<f.length-1;t++){const e=new Date(f[t]).getHours();if(e>=20||e<6){const e=$(f[t]),i=$(f[t+1]);o.fillStyle="rgba(0, 200, 83, 0.02)",o.fillRect(e,h,i-e,u)}}o.strokeStyle="rgba(255, 255, 255, 0.04)",o.lineWidth=.5;for(let t=0;t<=4;t++){const e=h+u/4*t;o.beginPath(),o.moveTo(p,e),o.lineTo(s-d,e),o.stroke()}if(r.length>1){const t=o.createLinearGradient(0,h,0,h+u);t.addColorStop(0,"rgba(84, 110, 122, 0.35)"),t.addColorStop(1,"rgba(84, 110, 122, 0.03)"),o.beginPath(),o.moveTo($(new Date(r[0].datetime).getTime()),h+u);for(const t of r)o.lineTo($(new Date(t.datetime).getTime()),b(t.value,100));o.lineTo($(new Date(r[r.length-1].datetime).getTime()),h+u),o.closePath(),o.fillStyle=t,o.fill(),o.beginPath();for(let t=0;t<r.length;t++){const e=$(new Date(r[t].datetime).getTime()),i=b(r[t].value,100);0===t?o.moveTo(e,i):o.lineTo(e,i)}o.strokeStyle="#78909C",o.lineWidth=2,o.stroke()}if(a.length>1){const t=o.createLinearGradient(0,h,0,h+u);t.addColorStop(0,"rgba(0, 200, 83, 0.18)"),t.addColorStop(1,"rgba(0, 200, 83, 0.02)"),o.beginPath(),o.moveTo($(new Date(a[0].datetime).getTime()),h+u);for(const t of a)o.lineTo($(new Date(t.datetime).getTime()),b(t.value/5*100,100));o.lineTo($(new Date(a[a.length-1].datetime).getTime()),h+u),o.closePath(),o.fillStyle=t,o.fill(),o.beginPath();for(let t=0;t<a.length;t++){const e=$(new Date(a[t].datetime).getTime()),i=b(a[t].value/5*100,100);0===t?o.moveTo(e,i):o.lineTo(e,i)}o.strokeStyle=yt,o.lineWidth=2,o.stroke()}if(l.length>1){o.beginPath(),o.setLineDash([5,3]);for(let t=0;t<l.length;t++){const e=$(new Date(l[t].datetime).getTime()),i=b(100*Math.max(0,1-l[t].value/27),100);0===t?o.moveTo(e,i):o.lineTo(e,i)}o.strokeStyle=bt,o.lineWidth=1.5,o.stroke(),o.setLineDash([])}const v=Date.now();if(v>=_&&v<=m){const t=$(v);o.strokeStyle="rgba(255, 255, 255, 0.35)",o.lineWidth=1,o.setLineDash([3,3]),o.beginPath(),o.moveTo(t,h),o.lineTo(t,h+u),o.stroke(),o.setLineDash([]),o.fillStyle="rgba(255, 255, 255, 0.5)",o.font="9px sans-serif",o.textAlign="center",o.fillText("Now",t,h-4)}o.fillStyle=mt,o.font="10px sans-serif",o.textAlign="center";const x=Math.max(1,Math.floor(f.length/7));for(let t=0;t<f.length;t+=x){const e=new Date(f[t]),i=e.toLocaleDateString(void 0,{weekday:"short"})+" "+e.toLocaleTimeString(void 0,{hour:"numeric"});o.fillText(i,$(f[t]),194)}o.textAlign="right",o.font="9px sans-serif";for(let t=0;t<=100;t+=25)o.fillText(`${t}`,p-6,b(t,100)+3)}render(){if(!this._config||!this.hass)return q;const t=this._getForecastData(this._config.cloud_cover_entity).length||"—";return W`
      <ha-card>
        <div class="header">
          <span class="title">${this._config.title||"Forecast"}</span>
          <span class="subtitle">${t}-hour outlook</span>
        </div>
        <div class="chart-wrap">
          <canvas></canvas>
        </div>
        <div class="legend">
          <div class="legend-item">
            <span class="legend-swatch" style="background: #78909C"></span>
            <span>Clouds</span>
          </div>
          <div class="legend-item">
            <span class="legend-swatch" style="background: ${yt}"></span>
            <span>Seeing</span>
          </div>
          <div class="legend-item">
            <span class="legend-swatch dashed" style="border-color: ${bt}"></span>
            <span>Transparency</span>
          </div>
        </div>
      </ha-card>
    `}}Bt.styles=a`
    :host { display: block; }
    ha-card {
      background: linear-gradient(145deg, rgba(26, 32, 64, 0.92) 0%, rgba(11, 16, 38, 0.97) 100%);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04);
      color: ${r(ft)};
      padding: 20px;
      border-radius: var(--ha-card-border-radius, 16px);
      overflow: hidden;
    }
    .header {
      display: flex; justify-content: space-between; align-items: baseline;
      padding-bottom: 12px;
    }
    .title { font-size: 1.1em; font-weight: 600; letter-spacing: 0.3px; }
    .subtitle { font-size: 0.8em; color: ${r(_t)}; }
    .chart-wrap { width: 100%; }
    canvas { width: 100%; display: block; border-radius: 8px; }
    .legend {
      display: flex; justify-content: center; gap: 16px;
      padding-top: 12px; margin-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .legend-item {
      display: flex; align-items: center; gap: 6px;
      font-size: 0.75em; color: ${r(_t)};
    }
    .legend-swatch {
      width: 14px; height: 3px; border-radius: 2px;
    }
    .legend-swatch.dashed {
      background: none; height: 0;
      border-top: 2px dashed;
      width: 14px;
    }
  `,t([pt({attribute:!1})],Bt.prototype,"hass",void 0),t([gt()],Bt.prototype,"_config",void 0),customElements.define("astrospheric-forecast-card",Bt);const It={GO:{label:"GO",color:yt,icon:"mdi:check-circle"},MARGINAL:{label:"MARGINAL",color:bt,icon:"mdi:alert-circle"},"NO-GO":{label:"NO-GO",color:xt,icon:"mdi:close-circle"}},jt={0:"Cloudy",1:"Poor",2:"Below Avg",3:"Average",4:"Above Avg",5:"Excellent"};class Lt extends lt{setConfig(t){this._config=t}getCardSize(){return 4}static getStubConfig(){return{type:"custom:astrospheric-tonight-card",seeing_entity:"",transparency_entity:"",cloud_cover_entity:"",seeing_go_threshold:4,transparency_go_threshold:9,cloud_go_threshold:20,seeing_nogo_threshold:2,cloud_nogo_threshold:70}}_getState(t){if(t&&this.hass)return this.hass.states[t]?.state}_getAttr(t,e){if(t&&this.hass)return this.hass.states[t]?.attributes[e]}_computeVerdict(){const t=Number(this._getState(this._config.seeing_entity))||0,e=Number(this._getState(this._config.transparency_entity))||0,i=Number(this._getState(this._config.cloud_cover_entity))||0,s=this._config.seeing_go_threshold??4,n=this._config.transparency_go_threshold??9,o=this._config.cloud_go_threshold??20,r=this._config.seeing_nogo_threshold??2,a=this._config.cloud_nogo_threshold??70;return t<=r||i>=a?"NO-GO":t>=s&&e<=n&&i<=o?"GO":"MARGINAL"}_findBestHour(){const t=this._getAttr(this._config.seeing_entity,"forecast"),e=Array.isArray(t)?t:[];if(0===e.length)return null;let i=-1,s="";for(const t of e){const e=new Date(t.datetime),n=e.getHours();(n>=20||n<6)&&t.value>i&&e.getTime()>Date.now()&&(i=t.value,s=e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))}return i>0?`${s} (${jt[i]||i})`:null}_renderConditionBar(t,e,i,s){const n=Math.max(2,Math.min(100,e));return W`
      <div class="cond-bar">
        <span class="cond-label">${t}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${n}%; background: linear-gradient(90deg, ${i}99, ${i})"></div>
        </div>
        <span class="cond-value" style="color: ${i}">${s}</span>
      </div>
    `}render(){if(!this._config||!this.hass)return q;const t=this._computeVerdict(),e=It[t],i=Number(this._getState(this._config.seeing_entity))||0,s=Number(this._getState(this._config.transparency_entity))||0,n=Number(this._getState(this._config.cloud_cover_entity))||0,o=this._findBestHour(),r=i/5*100,a=100*Math.max(0,1-s/27),l=100*Math.max(0,1-n/100);return W`
      <ha-card>
        <div class="header">
          <span class="title">${this._config.title||"Tonight's Outlook"}</span>
        </div>
        <div class="content">
          <div class="verdict-area">
            <div class="verdict-ring"
              style="border-color: ${e.color}; box-shadow: 0 0 24px ${e.color}40, inset 0 0 24px ${e.color}15; background: ${e.color}0A">
              <ha-icon icon="${e.icon}" style="--mdc-icon-size: 30px; color: ${e.color}"></ha-icon>
              <span class="verdict-label" style="color: ${e.color}">${e.label}</span>
            </div>
          </div>
          <div class="conditions">
            ${this._renderConditionBar("Seeing",r,Ct(i),jt[Math.round(i)]||`${i}`)}
            ${this._renderConditionBar("Transparency",a,Mt(s),`${s}`)}
            ${this._renderConditionBar("Clouds",l,Pt(n),`${n}%`)}
          </div>
          ${o?W`
            <div class="best-window">
              <ha-icon icon="mdi:star-four-points" style="--mdc-icon-size: 16px; color: ${At}"></ha-icon>
              <span>Best window: <strong>${o}</strong></span>
            </div>
          `:q}
        </div>
      </ha-card>
    `}}Lt.styles=a`
    :host { display: block; }
    ha-card {
      background: linear-gradient(145deg, rgba(26, 32, 64, 0.92) 0%, rgba(11, 16, 38, 0.97) 100%);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04);
      color: ${r(ft)};
      padding: 20px;
      border-radius: var(--ha-card-border-radius, 16px);
      overflow: hidden;
    }
    .header { padding-bottom: 16px; }
    .title { font-size: 1.1em; font-weight: 600; letter-spacing: 0.3px; }
    .content {
      display: flex; flex-direction: column; align-items: center; gap: 20px;
    }
    .verdict-area { padding: 8px 0; }
    .verdict-ring {
      width: 120px; height: 120px; border-radius: 50%;
      border: 3px solid;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 4px;
      animation: breathe 3s ease-in-out infinite;
    }
    @keyframes breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.04); }
    }
    .verdict-label {
      font-size: 1.3em; font-weight: 800; letter-spacing: 2px;
    }
    .conditions {
      width: 100%; display: flex; flex-direction: column; gap: 10px;
    }
    .cond-bar {
      display: grid; grid-template-columns: 100px 1fr 75px;
      align-items: center; gap: 10px;
    }
    .cond-label {
      font-size: 0.78em; text-transform: uppercase; letter-spacing: 0.5px;
      color: ${r(_t)};
    }
    .bar-track {
      height: 6px; background: rgba(255, 255, 255, 0.06);
      border-radius: 3px; overflow: hidden;
    }
    .bar-fill {
      height: 100%; border-radius: 3px;
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .cond-value {
      font-size: 0.8em; font-weight: 600; text-align: right;
    }
    .best-window {
      display: flex; align-items: center; gap: 8px;
      font-size: 0.85em; color: ${r(_t)};
      padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.06);
      width: 100%; justify-content: center;
    }
    .best-window strong { color: ${r(At)}; }
  `,t([pt({attribute:!1})],Lt.prototype,"hass",void 0),t([gt()],Lt.prototype,"_config",void 0),customElements.define("astrospheric-tonight-card",Lt);const Wt=[{type:"astrospheric-conditions-card",name:"Astrospheric Conditions",description:"Sky conditions gauges for seeing, transparency, and cloud cover"},{type:"astrospheric-moon-card",name:"Astrospheric Moon Phase",description:"Moon phase visualization with illumination and position"},{type:"astrospheric-sky-map-card",name:"Astrospheric Sky Map",description:"Polar sky map showing sun, moon, planets, and stars"},{type:"astrospheric-forecast-card",name:"Astrospheric Forecast",description:"81-hour forecast timeline with conditions overlay"},{type:"astrospheric-tonight-card",name:"Astrospheric Tonight",description:"Go/No-Go observing summary for tonight"}];window.customCards=window.customCards||[];for(const t of Wt)window.customCards.push(t);console.info("%c ASTROSPHERIC CARDS %c v1.0.0 ","color: white; background: #0B1026; font-weight: bold;","color: #0B1026; background: #FFD54F; font-weight: bold;")}();
