function defineReactive(data, key, val) {
    observe(val); // 递归遍历所有子属性
    var dep=new Dep();
    Object.defineProperty(data, key, {
        enumerable: true,//当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。
        configurable: true,//当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。
        get: function () {
            console.log("属性" + val + "已经被获取了")
           dep.depend();
            return val;
        },
        set: function (newVal) {
            if( val === newVal){
                return
            }
            val = newVal;
            console.log("属性" + key + "已经被监听了，现在值为：" + newVal.toString())
            dep.notify();// 如果数据变化，通知所有订阅者
        }
    })
}

function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    Object.keys(data).forEach(function (key) {
        defineReactive(data, key, data[key])
    })
}
// var library = {
//     book1: {
//         name: ''
//     },
//     book2: ''
// };
// observe(library);
// library.book1.name = 'vue权威指南'; // 属性name已经被监听了，现在值为：“vue权威指南”
// library.book2 = '没有此书籍';        // 属性book2已经被监听了，现在值为：“没有此书籍”

function Dep() {
    this.subs = [];
}
Dep.prototype={
    //增加订阅者
    addSub:function (sub) {
        this.subs.push(sub)
    },
    //判断是否增加订阅者
    depend:function(){
      if(Dep.target){
          this.addSub(Dep.target)
      }
    },
    //通知订阅者更新
    notify:function () {
        this.subs.forEach(function (sub) {
            sub.update();
        })
    }
}
Dep.target = null;