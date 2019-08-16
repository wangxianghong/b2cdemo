import Vue from "vue";
import App from "./App.vue";
import router from "./router"; //路由
import store from "./store"; //映入vuex
import "./plugins/axios"; //接口请求 封装axios
import scroll from "vue-seamless-scroll"; //引入 无缝轮播图功能

Vue.use(scroll);
Vue.config.productionTip = false;

//定义时间过滤器
Vue.filter("formatdate", function(value) {
  if (!value) {
    return "";
  }
  let dateD = value.split(" ")[0];
  let dateT = value.split(" ")[1];
  let formatD =
    dateD.split("/")[0] + "-" + dateD.split("/")[1] + "-" + dateD.split("/")[2];
  return formatD + " " + dateT;
});

//定义接口
const baseURL = "http://192.168.33.154:8025/official/"; //基础服务地址
let Token = "";
let MerchantCode = "S190304762"; //景区商户号
let baseAjax = new baseAjax(baseURL, "", MerchantCode);
let BTCAjax = new baseAjax(baseURL, Token, MerchantCode);

//获取商户信息
function getMerchantInfo() {
  BTCAjax.get("/Park/Info").then(res => {
    if (res.Code == "200") {
      store.dispatch("setMerchantData", res.Data);
      new Vue({
        router,
        store,
        render: h => h(App)
      }).$mount("$app");
      router.push("/Home");
    } else {
      Notification({
        title: "商户获取失败",
        message: res.Content,
        type: "error",
        showClose: false,
        duration: 0
      });
    }
  });
}

//刷新token的方法
function refrushTokenGet() {
  baseAjax.get("Token", {}).then(res => {
    Token = res.Data;
    BTCAjax._axios.defaults.headers.Token = Token;
    //若不存在商户信息则根据当前token重新获取商户信息
    if (!StorageEvent.state.merchantInfo.B2CName) {
      getMerchantInfo();
    }
  });
}
//默认执行一次刷新token
refrushTokenGet();

//30分钟默认刷新 token 为了方便使用29分钟时刷新赋值  每过一段时间执行一次刷新token方法
setInterval(() => {
  refrushTokenGet();
}, 1740000);

/* vue原型拓展ajax */
Vue.prototype.$baseAjax = baseAjax; //登录请求接口
Vue.prototype.$ajax = BTCAjax; //基于token的请求接口

//每次路由跳转判断是否登录

new Vue({
  render: h => h(App)
}).$mount("#app");
