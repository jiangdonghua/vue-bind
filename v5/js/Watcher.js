//声明一个订阅者

class Watcher {
    //node 订阅的节点
    //vm 全局vm对象
    //cb 发布时需要做事情
    constructor(vm, expr, cb) {
        //缓存重要属性
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;

        //缓存当前值
        this.value = this.get();
    }

    get() {
        Dep.target = this;// 缓存自己
        //获取当前值
        var value = this.vm.data[this.expr]; // 强制执行监听器里的get函数
        Dep.target = null;// 释放自己
        return value;
    }

    //提供更新方法，应对发布后
    update() {
        //获取新值
        var newVal = this.vm.data[this.expr];
        //判断后
        var oldVal = this.value;
        //判断后
        if (newVal !== oldVal) {
            //执行回调
            this.value = newVal;
            this.cb.call(this.vm, newVal,oldVal)
        }
    }

}