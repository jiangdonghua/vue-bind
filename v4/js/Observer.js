function Observer(data) {
    this.data=data;
    this.walk(data);
}

Observer.prototype={
    walk:function (data) {
     var self=this;   
     Object.keys(data).forEach(function (key) {
         self.defineReactive(data, key, data[key])
     })
    },
    defineReactive:function (data, key, val) {
        var dep=new Dep();
        var childObj = observe(val); // 递归遍历所有子属性

        Object.defineProperty(data, key, {
            enumerable: true,//当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。
            configurable: true,//当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。
            get: function () {
                //console.log("属性" + val + "已经被获取了")
                dep.depend();
                return val;
            },
            set: function (newVal) {
                if( val === newVal){
                    return
                }
                val = newVal;
                //console.log("属性" + key + "已经被监听了，现在值为：" + newVal.toString())
                dep.notify();// 如果数据变化，通知所有订阅者
            }
        })
    }
}


function observe(value) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value)
}


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