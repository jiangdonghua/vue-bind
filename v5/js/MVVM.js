class MVVM {
    constructor(options){
        this.vm=this;
        this.data=options.data;
        this.el=options.el;
        this.methods=options.methods;
        //视图必须存在
        if(this.el){
            // 绑定代理属性
            Object.keys(this.data).forEach((key)=>{
                this.proxyKeys(key);
            })

            //添加属性观察对象（实现数据挟持）
            new Observer(this.data);
            new Compile(this.el,this.vm)
            //创建模板编译器，来解析视图
            options.mounted.call(this);// 所有事情处理好后执行mounted函数
            return this;
        }
    }

    //实现一个属性代理
    proxyKeys(key){
      Object.defineProperty(this,key,{
          enumerable: false,
          configurable: true,
          get() {
              return this.data[key]
          },
          set(newVal) {
              this.data[key]=newVal
          }
      })
    }
}