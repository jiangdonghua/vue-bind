var obj={};
Object.defineProperty(obj,"hobby",{
    get:function () {
        console.log("hobby属性被获取")
    },
    set(v) {
        hobby=v
        console.log('hobby属性被设置为'+v)

    }
});

console.log(obj.hobby); //在得到obj的hobby属性 触发get方法 ;hobby属性被获取
obj.hobby="chi"; //在给obj设置hobby属性的时候 触发了set这个方法;hobby属性被设置为chi
