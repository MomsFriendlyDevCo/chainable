var u=class{$self;$source;$call(t,...e){let[s,r]=(Array.isArray(t)?t:t.split(".")).reduce((i,n)=>i?[i[1],i[1][n]]:void 0,[this.$source,this.$source]);return r.call(s,...e),this.$self}$get(t){return(Array.isArray(t)?t:t.split(".")).reduce((e,s)=>e?e[s]:void 0,this.$source)}$set(t,e){if(typeof t=="string"&&/\./.test(t)||Array.isArray(t)){let s=this.$source;(typeof t=="string"?t.split("."):t).forEach((r,i,n)=>{i==n.length-1?s[r]=e:(s[r]||(s[r]={}),s=s[r])})}else if(typeof t=="string")this.$source[t]=e;else if(typeof t=="object")Object.assign(this.$source,t);else throw new Error("$set needs string/object");return this.$self}$value(){return this.$source}$proxy(){let t=this;return new Proxy(t,{get(e,s){return typeof s=="string"&&s.startsWith("$")?t[s]:s in t.$source&&typeof t.$source[s]=="function"?t.$call.bind(t,s):typeof s=="string"&&`$${s}`in t?t[`$${s}`]:null}})}$tap(t){return t(this),this.$self}$thru(t){return this.$source=t(this),this.$self}constructor(t){this.$source=t}};function c($){let t=new u($).$proxy();return t.$self=t}export{u as Chainable,c as default};
