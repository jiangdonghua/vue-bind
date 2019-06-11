class Compile {
    constructor(el, vm) {
        this.vm = vm;
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.fragment = null;

        this.init();
    }

    init() {
        if (this.el) {
            //将对应范围的html放入内存fragment
            this.fragment = this.nodeToFragment(this.el);
            //编译模板
            this.compile(this.fragment);
            //将数据放回页面
            this.el.appendChild(this.fragment);
            console.log(this.el)
        } else {
            console.log('dom元素不存在');
        }
    }

    //把模板放入内存
    nodeToFragment(node) {
        var fragment = document.createDocumentFragment();
        var child = node.firstChild;
        // while (child = node.firstChild) {
        //     fragment.appendChild(child)
        // }
        while (child) {
            // 将Dom元素移入fragment中
            fragment.append(child);
            child = node.firstChild
        }
        return fragment;
    }

    //编译模板方法
    compile(parent) {
        var childNodes = parent.childNodes;
        var Arr = this.toArray(childNodes);

        Arr.forEach(node => {
            var reg = /\{\{\s*(.*?)\s*\}\}/;
            var text = node.textContent;
            if (this.isElementNode(node)) {
                this.compileElement(node);
            } else if (this.isTextNode(node) && reg.test(text)) {
                this.compileText(node, reg.exec(text)[1])
            }
            if (node.childNodes && node.childNodes.length) {
                this.compile(node); // 继续递归遍历子节点
            }
        })

    }

    compileElement(node) {
        var nodeAttrs = node.attributes;
        this.toArray(nodeAttrs).forEach(attr => {
            var attrName = attr.name;
            if (this.isDirective(attrName)) {
                //获取v-text的text等
                var type = attrName.substring(2);
                var expr = attr.value;

                if (this.isEventDirective(type)) {
                    console.log(expr)
                    this.CompilerUtils.compileEvent(node, this.vm, expr, type)
                } else {
                    this.CompilerUtils[type] && this.CompilerUtils[type](node, this.vm, expr, type)
                }
                node.removeAttribute(attrName);
            }
        })
    }

    compileText(node, expr) {

        this.CompilerUtils.text(node, this.vm, expr)
    }


    CompilerUtils = {
        /*******解析v-text指令时候只执行一次，但是里面的更新数据方法会执行n多次*********/
        text(node, vm, expr) {
            /*第一次*/
            var updateFn = this.updater.textUpdater;

            updateFn && updateFn(node, vm[expr]);
            /*第n+1次 */
            new Watcher(vm, expr, (newVal) => {
                updateFn && updateFn(node, newVal)
            })
        },
        model(node, vm, expr) {
            /*第一次*/
            var updateFn = this.updater.modelUpdater;
            updateFn && updateFn(node, vm[expr]);
            /*第n+1次 */
            new Watcher(vm, expr, (newVal) => {
                updateFn && updateFn(node, newVal)
            });
            node.addEventListener('input', (e) => {
                var newVal = e.target.value;
                if (vm[expr] === newVal) {
                    return
                }
                vm[expr] = newVal;
            })
        },
        compileEvent(node, vm, expr, dir) {
            var eventType=dir.split(":")[1];
            var cb=vm.methods&&vm.methods[expr];
            console.log(vm.methods[expr]);
            if(eventType&&cb){
                node.addEventListener(eventType,cb.bind(vm),false);
            }
        },

        updater: {
            //v-text数据回填
            textUpdater(node, value) {
                node.textContent = typeof value == 'undefined' ? "" : value;
            },
            //v-model数据回填
            modelUpdater(node, value, type) {
                node.value = typeof value == 'undefined' ? "" : value;
            }
        }
    }


    /*********************工具方法**************************** */

    //类似数组变数组
    toArray(fakeArr) {
        return [].slice.call(fakeArr)
    }

    isTextNode(node) { //文本节点
        return node.nodeType === 3;
    }

    isElementNode(node) {//元素节点
        return node.nodeType === 1;
    }

    isDirective(directiveName) {
        return directiveName.indexOf('v-') >= 0;
    }

    isEventDirective(dir) {//事件指令
        return dir.indexOf('on:') === 0;
    }
}