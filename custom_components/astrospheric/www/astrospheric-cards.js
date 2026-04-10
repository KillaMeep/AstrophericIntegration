!function(){"use strict";function t(t,e,s,i){var o,r=arguments.length,n=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(r<3?o(n):r>3?o(e,s,n):o(e,s))||n);return r>3&&n&&Object.defineProperty(e,s,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(s,t,i)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:c,defineProperty:h,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,f=g.trustedTypes,_=f?f.emptyScript:"",m=g.reactiveElementPolyfillSupport,v=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},y=(t,e)=>!c(t,e),b={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&h(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);o?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:$).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=i;const r=o.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const r=this.constructor;if(!1===i&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??y)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,m?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");const A=globalThis,w=t=>t,S=A.trustedTypes,E=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+P,M=`<${k}>`,N=document,T=()=>N.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,F=Array.isArray,z="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,D=/>/g,H=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,I=/"/g,j=/^(?:script|style|textarea|title)$/i,L=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),G=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,V=N.createTreeWalker(N,129);function J(t,e){if(!F(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const Z=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=U;for(let e=0;e<s;e++){const s=t[e];let a,c,h=-1,l=0;for(;l<s.length&&(n.lastIndex=l,c=n.exec(s),null!==c);)l=n.lastIndex,n===U?"!--"===c[1]?n=R:void 0!==c[1]?n=D:void 0!==c[2]?(j.test(c[2])&&(o=RegExp("</"+c[2],"g")),n=H):void 0!==c[3]&&(n=H):n===H?">"===c[0]?(n=o??U,h=-1):void 0===c[1]?h=-2:(h=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?H:'"'===c[3]?I:B):n===I||n===B?n=H:n===R||n===D?n=U:(n=H,o=void 0);const d=n===H&&t[e+1].startsWith("/>")?" ":"";r+=n===U?s+M:h>=0?(i.push(a),s.slice(0,h)+C+s.slice(h)+P+d):s+P+(-2===h?e:d)}return[J(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[c,h]=Z(t,e);if(this.el=K.createElement(c,s),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=V.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=h[r++],s=i.getAttribute(t).split(P),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?et:"?"===n[1]?st:"@"===n[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(P)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(P),e=t.length-1;if(e>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],T()),V.nextNode(),a.push({type:2,index:++o});i.append(t[e],T())}}}else if(8===i.nodeType)if(i.data===k)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(P,t+1));)a.push({type:7,index:o}),t+=P.length-1}o++}}static createElement(t,e){const s=N.createElement("template");return s.innerHTML=t,s}}function Q(t,e,s=t,i){if(e===G)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=O(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,i)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??N).importNode(e,!0);V.currentNode=i;let o=V.nextNode(),r=0,n=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Y(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new ot(o,this,t)),this._$AV.push(e),a=s[++n]}r!==a?.index&&(o=V.nextNode(),r++)}return V.currentNode=N,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),O(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>F(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(N.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new X(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new K(t)),e}k(t){F(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new Y(this.O(T()),this.O(T()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=Q(this,t,e,0),r=!O(t)||t!==this._$AH&&t!==G,r&&(this._$AH=t);else{const i=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=Q(this,i[s+n],e,n),a===G&&(a=this._$AH[n]),r||=!O(a)||a!==this._$AH[n],a===W?t=W:t!==W&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!i&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class st extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class it extends tt{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??W)===G)return;const s=this._$AH,i=t===W&&s!==W||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const rt=A.litHtmlPolyfillSupport;rt?.(K,Y),(A.litHtmlVersions??=[]).push("3.3.2");const nt=globalThis;class at extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new Y(e.insertBefore(T(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const ct=nt.litElementPolyfillSupport;ct?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.2");const ht={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:y},lt=(t=ht,e,s)=>{const{kind:i,metadata:o}=s;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function dt(t){return(e,s)=>"object"==typeof s?lt(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function pt(t){return dt({...t,state:!0,attribute:!1})}const ut="#0B1026",gt="#1A2040",ft="#E8E6E3",_t="#8B8FA3",mt="#5C6078",vt="#00C853",$t="#64DD17",yt="#FFD600",bt="#FF9100",xt="#FF1744",At="#FFF8E1",wt="#FFD54F",St="rgba(255, 213, 79, 0.3)",Et={Mercury:"#B0BEC5",Venus:"#FFF59D",Mars:"#E57373",Jupiter:"#FFB74D",Saturn:"#FFE082",Uranus:"#80DEEA",Neptune:"#64B5F6"};function Ct(t){return t>=.8?vt:t>=.6?$t:t>=.4?yt:t>=.2?bt:xt}const Pt={0:"Cloudy",1:"Poor",2:"Below Avg",3:"Average",4:"Above Avg",5:"Excellent"},kt=[[5,"Excellent"],[9,"Above Avg"],[13,"Average"],[23,"Below Avg"],[27,"Poor"]];class Mt extends at{setConfig(t){this._config=t}getCardSize(){return 4}static getConfigElement(){return document.createElement("astrospheric-conditions-editor")}_getState(t){if(t&&this.hass)return this.hass.states[t]?.state}_getAttr(t,e){if(t&&this.hass)return this.hass.states[t]?.attributes[e]}render(){if(!this._config||!this.hass)return W;const t=Number(this._getState(this._config.seeing_entity))||0,e=Number(this._getState(this._config.transparency_entity))||0,s=Number(this._getState(this._config.cloud_cover_entity))||0,i=this._getState(this._config.temperature_entity),o=this._getState(this._config.dew_point_entity),r=this._getState(this._config.wind_speed_entity),n=this._getAttr(this._config.wind_direction_entity,"cardinal")||"",a=Pt[Math.round(t)]||"Unknown",c=function(t){for(const[e,s]of kt)if(t<=e)return s;return"Cloudy"}(e);return L`
      <ha-card>
        <div class="card-header">
          <span class="title">${this._config.title||"Sky Conditions"}</span>
        </div>
        <div class="card-content">
          <div class="gauges">
            ${this._renderGauge("Seeing",t,5,a,(h=t,Ct(h/5)))}
            ${this._renderGauge("Transparency",e,27,c,function(t){return Ct(Math.max(0,1-t/27))}(e))}
            ${this._renderGauge("Cloud Cover",s,100,`${s}%`,function(t){return Ct(Math.max(0,1-t/100))}(s))}
          </div>
          <div class="compact-row">
            ${void 0!==i?L`
              <div class="compact-item">
                <ha-icon icon="mdi:thermometer"></ha-icon>
                <span>${i}&deg;</span>
              </div>
            `:W}
            ${void 0!==o?L`
              <div class="compact-item">
                <ha-icon icon="mdi:thermometer-water"></ha-icon>
                <span>${o}&deg;</span>
              </div>
            `:W}
            ${void 0!==r?L`
              <div class="compact-item">
                <ha-icon icon="mdi:weather-windy"></ha-icon>
                <span>${r} ${n}</span>
              </div>
            `:W}
          </div>
        </div>
      </ha-card>
    `;var h}_renderGauge(t,e,s,i,o){const r=Math.min(100,e/s*100);return L`
      <div class="gauge">
        <div class="gauge-label">${t}</div>
        <div class="gauge-track">
          <div class="gauge-fill" style="width: ${r}%; background: ${o}"></div>
        </div>
        <div class="gauge-value" style="color: ${o}">${i}</div>
      </div>
    `}}Mt.styles=n`
    :host {
      display: block;
    }
    ha-card {
      background: var(--ha-card-background, ${n`${gt}`});
      color: var(--primary-text-color, ${n`${ft}`});
      padding: 16px;
      border-radius: var(--ha-card-border-radius, 12px);
    }
    .card-header {
      padding-bottom: 12px;
    }
    .title {
      font-size: 1.1em;
      font-weight: 500;
    }
    .gauges {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .gauge {
      display: grid;
      grid-template-columns: 110px 1fr 90px;
      align-items: center;
      gap: 12px;
    }
    .gauge-label {
      font-size: 0.9em;
      color: var(--secondary-text-color, #8B8FA3);
    }
    .gauge-track {
      height: 8px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      overflow: hidden;
    }
    .gauge-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.6s ease, background 0.6s ease;
    }
    .gauge-value {
      font-size: 0.85em;
      font-weight: 600;
      text-align: right;
    }
    .compact-row {
      display: flex;
      justify-content: space-around;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color, rgba(255,255,255,0.06));
    }
    .compact-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85em;
      color: var(--secondary-text-color, #8B8FA3);
    }
    .compact-item ha-icon {
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color, #8B8FA3);
    }
  `,t([dt({attribute:!1})],Mt.prototype,"hass",void 0),t([pt()],Mt.prototype,"_config",void 0),customElements.define("astrospheric-conditions-card",Mt);class Nt extends at{setConfig(t){this._config=t}getCardSize(){return 4}static getConfigElement(){return document.createElement("astrospheric-moon-editor")}_getState(t){if(t&&this.hass)return this.hass.states[t]?.state}_getAttr(t,e){if(t&&this.hass)return this.hass.states[t]?.attributes[e]}render(){if(!this._config||!this.hass)return W;const t=this._getState(this._config.moon_phase_entity)||"Unknown",e=Number(this._getAttr(this._config.moon_phase_entity,"phase_value"))||0,s=Number(this._getState(this._config.moon_illumination_entity))||0,i=Number(this._getState(this._config.moon_altitude_entity))||0,o=Number(this._getState(this._config.moon_azimuth_entity))||0,r=function(t,e,s){const i=s/2,o=s/2,r=s/2-2,n=`<circle cx="${i}" cy="${o}" r="${r}" fill="#2A2D35"/>`,a=e/100;if(a<.01)return`<svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}">\n      ${n}\n      <circle cx="${i}" cy="${o}" r="${r}" fill="none" stroke="${mt}" stroke-width="0.5"/>\n    </svg>`;if(a>.99)return`<svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}">\n      <circle cx="${i}" cy="${o}" r="${r}" fill="${At}"/>\n    </svg>`;const c=t<.5,h=Math.cos(2*t*Math.PI)*r;return`<svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}">\n    ${n}\n    <path d="\n    M ${i} ${o-r}\n    A ${r} ${r} 0 0 ${c?1:0} ${i} ${o+r}\n    A ${Math.abs(h)} ${r} 0 0 ${h>0?1:0} ${i} ${o-r}\n    Z\n  " fill="${At}"/>\n  </svg>`}(e,s,120),n=i<0;return L`
      <ha-card>
        <div class="card-header">
          <span class="title">${this._config.title||"Moon"}</span>
        </div>
        <div class="card-content">
          <div class="moon-visual" .innerHTML=${r}></div>
          <div class="phase-name">${t}</div>
          <div class="illumination">${s.toFixed(1)}% illuminated</div>
          <div class="position-row">
            <div class="pos-item">
              <span class="pos-label">Altitude</span>
              <span class="pos-value ${n?"below":""}">${i.toFixed(1)}&deg;</span>
              ${n?L`<span class="below-tag">Below horizon</span>`:W}
            </div>
            <div class="pos-item">
              <span class="pos-label">Azimuth</span>
              <span class="pos-value">${o.toFixed(1)}&deg;</span>
            </div>
          </div>
        </div>
      </ha-card>
    `}}function Tt(t,e,s){const i=(90-Math.max(0,t))/90*s,o=(e-90)*Math.PI/180;return[i*Math.cos(o),i*Math.sin(o)]}function Ot(t){const e=Math.max(-1.5,Math.min(5.5,t));return Math.max(.5,4-.5*(e+1.5))}Nt.styles=n`
    :host {
      display: block;
    }
    ha-card {
      background: var(--ha-card-background, #1A2040);
      color: var(--primary-text-color, #E8E6E3);
      padding: 16px;
      border-radius: var(--ha-card-border-radius, 12px);
    }
    .card-header {
      padding-bottom: 8px;
    }
    .title {
      font-size: 1.1em;
      font-weight: 500;
    }
    .card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .moon-visual {
      margin: 8px 0;
      filter: drop-shadow(0 0 12px rgba(255, 248, 225, 0.15));
    }
    .moon-visual svg {
      display: block;
    }
    .phase-name {
      font-size: 1.2em;
      font-weight: 600;
      color: #FFF8E1;
    }
    .illumination {
      font-size: 0.9em;
      color: var(--secondary-text-color, #8B8FA3);
    }
    .position-row {
      display: flex;
      gap: 32px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color, rgba(255,255,255,0.06));
    }
    .pos-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .pos-label {
      font-size: 0.75em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--secondary-text-color, #8B8FA3);
    }
    .pos-value {
      font-size: 1.1em;
      font-weight: 600;
    }
    .pos-value.below {
      color: #FF9100;
    }
    .below-tag {
      font-size: 0.7em;
      color: #FF9100;
      background: rgba(255, 145, 0, 0.12);
      padding: 1px 6px;
      border-radius: 4px;
    }
  `,t([dt({attribute:!1})],Nt.prototype,"hass",void 0),t([pt()],Nt.prototype,"_config",void 0),customElements.define("astrospheric-moon-card",Nt);class Ft extends at{setConfig(t){this._config=t}getCardSize(){return 6}_getState(t){if(t&&this.hass)return this.hass.states[t]?.state}_getAttr(t,e){if(t&&this.hass)return this.hass.states[t]?.attributes[e]}firstUpdated(){this._canvas=this.shadowRoot?.querySelector("canvas"),this._drawSkyMap()}updated(){this._drawSkyMap()}_drawSkyMap(){if(!this._canvas||!this.hass||!this._config)return;const t=this._canvas,e=t.width,s=t.getContext("2d");if(!s)return;const i=e/2,o=e/2,r=e/2-30;s.clearRect(0,0,e,e),s.fillStyle=ut,s.beginPath(),s.arc(i,o,r+20,0,2*Math.PI),s.fill(),s.strokeStyle="rgba(255, 255, 255, 0.08)",s.lineWidth=1;for(const t of[30,60]){const e=(90-t)/90*r;s.beginPath(),s.arc(i,o,e,0,2*Math.PI),s.stroke()}s.strokeStyle="rgba(255, 255, 255, 0.2)",s.lineWidth=1.5,s.beginPath(),s.arc(i,o,r,0,2*Math.PI),s.stroke(),s.fillStyle=_t,s.font="12px sans-serif",s.textAlign="center",s.textBaseline="middle";const n=[{label:"N",angle:-Math.PI/2},{label:"E",angle:0},{label:"S",angle:Math.PI/2},{label:"W",angle:Math.PI}];for(const t of n){const e=i+(r+15)*Math.cos(t.angle),n=o+(r+15)*Math.sin(t.angle);s.fillText(t.label,e,n)}s.strokeStyle="rgba(255, 255, 255, 0.04)",s.lineWidth=.5,s.beginPath(),s.moveTo(i-r,o),s.lineTo(i+r,o),s.moveTo(i,o-r),s.lineTo(i,o+r),s.stroke();const a=Number(this._getState(this._config.sun_altitude_entity))||0,c=Number(this._getState(this._config.sun_azimuth_entity))||0;if(a>0){const[t,e]=Tt(a,c,r),n=s.createRadialGradient(i+t,o+e,0,i+t,o+e,12);n.addColorStop(0,St),n.addColorStop(1,"transparent"),s.fillStyle=n,s.beginPath(),s.arc(i+t,o+e,12,0,2*Math.PI),s.fill(),s.fillStyle=wt,s.beginPath(),s.arc(i+t,o+e,5,0,2*Math.PI),s.fill(),s.fillStyle=wt,s.font="10px sans-serif",s.fillText("Sun",i+t,o+e-10)}const h=Number(this._getState(this._config.moon_altitude_entity))||0,l=Number(this._getState(this._config.moon_azimuth_entity))||0;if(h>0){const[t,e]=Tt(h,l,r);s.fillStyle=At,s.beginPath(),s.arc(i+t,o+e,5,0,2*Math.PI),s.fill(),s.font="10px sans-serif",s.fillText("Moon",i+t,o+e-10)}const d=this._getAttr(this._config.visible_planets_entity,"planets")||[];for(const t of d){if(t.altitude<=0)continue;const[e,n]=Tt(t.altitude,t.azimuth,r),a=Et[t.name]||ft,c=Ot(t.magnitude);s.fillStyle=a,s.beginPath(),s.arc(i+e,o+n,Math.max(c,2.5),0,2*Math.PI),s.fill(),s.font="9px sans-serif",s.fillStyle=a,s.fillText(t.name,i+e,o+n-8)}s.fillStyle="rgba(255, 255, 255, 0.15)",s.beginPath(),s.arc(i,o,2,0,2*Math.PI),s.fill()}render(){return this._config&&this.hass?L`
      <ha-card>
        <div class="card-header">
          <span class="title">${this._config.title||"Sky Map"}</span>
        </div>
        <div class="card-content">
          <canvas width="300" height="300"></canvas>
        </div>
      </ha-card>
    `:W}}Ft.styles=n`
    :host {
      display: block;
    }
    ha-card {
      background: var(--ha-card-background, #1A2040);
      color: var(--primary-text-color, #E8E6E3);
      padding: 16px;
      border-radius: var(--ha-card-border-radius, 12px);
    }
    .card-header {
      padding-bottom: 8px;
    }
    .title {
      font-size: 1.1em;
      font-weight: 500;
    }
    .card-content {
      display: flex;
      justify-content: center;
    }
    canvas {
      max-width: 100%;
      height: auto;
    }
  `,t([dt({attribute:!1})],Ft.prototype,"hass",void 0),t([pt()],Ft.prototype,"_config",void 0),customElements.define("astrospheric-sky-map-card",Ft);class zt extends at{setConfig(t){this._config=t}getCardSize(){return 5}disconnectedCallback(){super.disconnectedCallback(),this._chart?.destroy(),this._chart=void 0,this._resizeObserver?.disconnect()}_getForecastData(t){if(!t||!this.hass)return[];const e=this.hass.states[t];return e&&e.attributes.forecast||[]}firstUpdated(){this._initChart()}updated(){this._updateChart()}_initChart(){const t=this.shadowRoot?.querySelector(".chart-container");if(!t)return;if(void 0===window.uPlot)return void this._renderFallback(t);const e=this._getForecastData(this._config.cloud_cover_entity);if(0===e.length)return;const s=e.map(t=>new Date(t.datetime).getTime()/1e3),i=e.map(t=>t.value),o=this._getForecastData(this._config.seeing_entity).map(t=>t.value),r=this._getForecastData(this._config.transparency_entity).map(t=>t.value),n=t.clientWidth||400,a=Date.now()/1e3,c={width:n,height:250,cursor:{show:!0},scales:{x:{time:!0},y:{auto:!0},y2:{auto:!0,side:1}},axes:[{stroke:_t,grid:{stroke:"rgba(255,255,255,0.05)"}},{stroke:_t,grid:{stroke:"rgba(255,255,255,0.05)"},label:"Cloud %"},{stroke:_t,side:1,grid:{show:!1},label:"Seeing"}],series:[{},{label:"Cloud Cover",stroke:"#546E7A",fill:"rgba(84, 110, 122, 0.15)",width:2,scale:"y"},{label:"Seeing",stroke:vt,width:2,scale:"y2"},{label:"Transparency",stroke:yt,width:2,dash:[5,3],scale:"y"}],plugins:[{hooks:{draw:[t=>{const e=t.ctx,s=t.valToPos(a,"x",!0);s>t.bbox.left&&s<t.bbox.left+t.bbox.width&&(e.save(),e.strokeStyle="rgba(255, 255, 255, 0.4)",e.lineWidth=1,e.setLineDash([4,4]),e.beginPath(),e.moveTo(s,t.bbox.top),e.lineTo(s,t.bbox.top+t.bbox.height),e.stroke(),e.restore())}]}}]},h=[s,i,o,r];this._chart=new window.uPlot(c,h,t),this._resizeObserver=new ResizeObserver(()=>{this._chart&&t.clientWidth>0&&this._chart.setSize({width:t.clientWidth,height:250})}),this._resizeObserver.observe(t)}_updateChart(){if(!this._chart||!this._config)return;const t=this._getForecastData(this._config.cloud_cover_entity);if(0===t.length)return;const e=t.map(t=>new Date(t.datetime).getTime()/1e3),s=t.map(t=>t.value),i=this._getForecastData(this._config.seeing_entity).map(t=>t.value),o=this._getForecastData(this._config.transparency_entity).map(t=>t.value);this._chart.setData([e,s,i,o])}_renderFallback(t){const e=this._getForecastData(this._config.cloud_cover_entity);if(0===e.length)return void(t.innerHTML='<div style="padding: 20px; text-align: center; color: #8B8FA3;">No forecast data available</div>');let s='<div style="display: flex; gap: 1px; height: 80px; align-items: flex-end;">';for(const t of e){s+=`<div style="flex: 1; height: ${Math.max(2,t.value/100*80)}px; background: ${t.value<30?vt:t.value<60?yt:xt}; border-radius: 1px 1px 0 0;" title="${t.datetime}: ${t.value}%"></div>`}s+="</div>",s+='<div style="display: flex; justify-content: space-between; font-size: 10px; color: #8B8FA3; margin-top: 4px;">',s+=`<span>Now</span><span>+${e.length}h</span>`,s+="</div>",t.innerHTML=s}render(){return this._config&&this.hass?L`
      <ha-card>
        <div class="card-header">
          <span class="title">${this._config.title||"Forecast"}</span>
          <span class="subtitle">81-hour outlook</span>
        </div>
        <div class="card-content">
          <div class="chart-container"></div>
        </div>
      </ha-card>
    `:W}}zt.styles=n`
    :host {
      display: block;
    }
    ha-card {
      background: var(--ha-card-background, #1A2040);
      color: var(--primary-text-color, #E8E6E3);
      padding: 16px;
      border-radius: var(--ha-card-border-radius, 12px);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-bottom: 12px;
    }
    .title {
      font-size: 1.1em;
      font-weight: 500;
    }
    .subtitle {
      font-size: 0.8em;
      color: var(--secondary-text-color, #8B8FA3);
    }
    .chart-container {
      width: 100%;
      min-height: 80px;
    }
    /* uPlot theme overrides */
    .chart-container :global(.u-wrap) {
      background: transparent !important;
    }
  `,t([dt({attribute:!1})],zt.prototype,"hass",void 0),t([pt()],zt.prototype,"_config",void 0),customElements.define("astrospheric-forecast-card",zt);const Ut={GO:{label:"GO",color:vt,bg:"rgba(0, 200, 83, 0.12)",icon:"mdi:check-circle"},MARGINAL:{label:"MARGINAL",color:yt,bg:"rgba(255, 214, 0, 0.12)",icon:"mdi:alert-circle"},"NO-GO":{label:"NO-GO",color:xt,bg:"rgba(255, 23, 68, 0.12)",icon:"mdi:close-circle"}},Rt={0:"Cloudy",1:"Poor",2:"Below Avg",3:"Average",4:"Above Avg",5:"Excellent"};class Dt extends at{setConfig(t){this._config=t}getCardSize(){return 3}_getState(t){if(t&&this.hass)return this.hass.states[t]?.state}_getAttr(t,e){if(t&&this.hass)return this.hass.states[t]?.attributes[e]}_computeVerdict(){const t=Number(this._getState(this._config.seeing_entity))||0,e=Number(this._getState(this._config.transparency_entity))||0,s=Number(this._getState(this._config.cloud_cover_entity))||0,i=this._config.seeing_go_threshold??4,o=this._config.transparency_go_threshold??9,r=this._config.cloud_go_threshold??20,n=this._config.seeing_nogo_threshold??2,a=this._config.cloud_nogo_threshold??70;return t<=n||s>=a?"NO-GO":t>=i&&e<=o&&s<=r?"GO":"MARGINAL"}_findBestHour(){const t=this._getAttr(this._config.seeing_entity,"forecast")||[];if(0===t.length)return null;let e=-1,s="";for(const i of t){const t=new Date(i.datetime),o=t.getHours();(o>=20||o<6)&&i.value>e&&t.getTime()>Date.now()&&(e=i.value,s=t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))}return e>0?`${s} (${Rt[e]||e})`:null}render(){if(!this._config||!this.hass)return W;const t=this._computeVerdict(),e=Ut[t],s=Number(this._getState(this._config.seeing_entity))||0,i=Number(this._getState(this._config.transparency_entity))||0,o=Number(this._getState(this._config.cloud_cover_entity))||0,r=this._findBestHour();return L`
      <ha-card>
        <div class="card-header">
          <span class="title">${this._config.title||"Tonight"}</span>
        </div>
        <div class="card-content">
          <div class="verdict-badge" style="background: ${e.bg}; color: ${e.color}; border: 2px solid ${e.color}">
            <ha-icon icon="${e.icon}" style="--mdc-icon-size: 28px; color: ${e.color}"></ha-icon>
            <span class="verdict-text">${e.label}</span>
          </div>
          <div class="stats">
            <div class="stat">
              <span class="stat-label">Seeing</span>
              <span class="stat-value">${Rt[Math.round(s)]||s}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Transparency</span>
              <span class="stat-value">${i}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Clouds</span>
              <span class="stat-value">${o}%</span>
            </div>
          </div>
          ${r?L`
            <div class="best-hour">
              <ha-icon icon="mdi:star" style="--mdc-icon-size: 16px; color: ${wt}"></ha-icon>
              <span>Best window: ${r}</span>
            </div>
          `:W}
        </div>
      </ha-card>
    `}}Dt.styles=n`
    :host {
      display: block;
    }
    ha-card {
      background: var(--ha-card-background, #1A2040);
      color: var(--primary-text-color, #E8E6E3);
      padding: 16px;
      border-radius: var(--ha-card-border-radius, 12px);
    }
    .card-header {
      padding-bottom: 12px;
    }
    .title {
      font-size: 1.1em;
      font-weight: 500;
    }
    .card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .verdict-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 28px;
      border-radius: 12px;
      font-weight: 700;
    }
    .verdict-text {
      font-size: 1.6em;
      letter-spacing: 2px;
    }
    .stats {
      display: flex;
      gap: 24px;
      width: 100%;
      justify-content: center;
    }
    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .stat-label {
      font-size: 0.75em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--secondary-text-color, #8B8FA3);
    }
    .stat-value {
      font-size: 1em;
      font-weight: 600;
    }
    .best-hour {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85em;
      color: var(--secondary-text-color, #8B8FA3);
      padding-top: 8px;
      border-top: 1px solid var(--divider-color, rgba(255,255,255,0.06));
      width: 100%;
      justify-content: center;
    }
  `,t([dt({attribute:!1})],Dt.prototype,"hass",void 0),t([pt()],Dt.prototype,"_config",void 0),customElements.define("astrospheric-tonight-card",Dt);const Ht=[{type:"astrospheric-conditions-card",name:"Astrospheric Conditions",description:"Sky conditions gauges for seeing, transparency, and cloud cover"},{type:"astrospheric-moon-card",name:"Astrospheric Moon Phase",description:"Moon phase visualization with illumination and position"},{type:"astrospheric-sky-map-card",name:"Astrospheric Sky Map",description:"Polar sky map showing sun, moon, planets, and stars"},{type:"astrospheric-forecast-card",name:"Astrospheric Forecast",description:"81-hour forecast timeline with conditions overlay"},{type:"astrospheric-tonight-card",name:"Astrospheric Tonight",description:"Go/No-Go observing summary for tonight"}];window.customCards=window.customCards||[];for(const t of Ht)window.customCards.push(t);console.info("%c ASTROSPHERIC CARDS %c v1.0.0 ","color: white; background: #0B1026; font-weight: bold;","color: #0B1026; background: #FFD54F; font-weight: bold;")}();
