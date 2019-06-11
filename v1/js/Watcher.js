function Watcher(vm, exp, cb) {
    this.vm = vm; //一个Vue的实例对象
    this.exp = exp; //是node节点的v-model或v-on：click等指令的属性值。如v-model="name"，exp就是name;
    this.cb = cb;//是Watcher绑定的更新函数;
    this.value = this.get(); // 将自己添加到订阅器的操作
}

Watcher.prototype = {
    update: function () {
        this.run();
    },
    run: function () {
        var value = this.vm.data[this.exp];
        var oldValue = this.value;
        if (value !== oldValue) {
            this.value = value;
            this.cb.call(this.vm, value, oldValue);
        }
    },
    get: function () {
        Dep.target = this; // 缓存自己
        var value = this.vm.data[this.exp];// 强制执行监听器里的get函数
        Dep.target = null;// 释放自己
        return value;
    }
}