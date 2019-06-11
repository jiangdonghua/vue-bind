//创建观察对象
class Observer {
    constructor(data) {
        //提供一个解析方法，完成属性的分析和挟持
        this.observe(data)
    }

    //解析数据，完成对数据属性的挟持，控制对象属性的get和set
    observe(data) {
        if (!data || typeof data !== 'object') {
            return;
        }

        Object.keys(data).forEach((key) => {
            this.defineReactive(data, key, data[key])
        })
    }

    defineReactive(data, key, val) {
        var dep = new Dep();

        this.observe(val);
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                //真对watcher创建时，直接完成发布订阅的添加
                var watcher = Dep.target;
                watcher && dep.addSubs(watcher);
                //console.log(watcher)
                return val;
            },
            set(newVal) {
                if (val === newVal) {
                    return
                }
                val = newVal;
                dep.notify(); //通知更新
            }
        })
    }
}

//消息订阅器Dep 创建订阅发布者
//1.管理订阅
//2.集体通知
class Dep {
    constructor() {
        this.subs = []
    }

    //添加订阅 其实就是watcher对象
    addSubs(sub) {
        this.subs.push(sub)
    }

    notify() {
        this.subs.forEach((sub) => {
            sub.update()
        })
    }
}
