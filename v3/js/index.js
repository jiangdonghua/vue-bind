function SelfVue(options) {
    var self=this;
    this.vm=this;
    this.data=options.data;
    this.methods=options.methods;

    Object.keys(this.data).forEach(function (key) {
        self.proxyKeys(key);// 绑定代理属性
    })

    observe(this.data);
    new Compile(options.el,this.vm);
    options.mounted.call(this);// // 所有事情处理好后执行mounted函数

    return this;
}

SelfVue.prototype={
    proxyKeys:function (key) {
        var self=this;
        Object.defineProperty(this,key,{
            enumerable: false,
            configurable: true,
            get:function proxyGetter(){
                return self.data[key]
            },
            set:function proxyGetter(newVal){
                self.data[key]=newVal;
            }
        })
    }
}
