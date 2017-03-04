/**
 * Created by xjh on 2016/10/17.
 */
/**
 *       getStyle1:getStyle1,    两个参数(elem[目标元素]name(目标属性))
 *                                  已知bug 不能获取边框属性
         getStyle2:getStyle2,    两个参数(elem[目标元素]name(目标属性))
         getClass1:getClass1,    两个参数(name[获取的类名],type(获取元素的类型))
         getClass2:getClass2,    两个参数(parent[获取元素的父级],cls[获取元素的类名])
         addEvent1:addEvent1,    三个参数(elem[添加事件的元素],type[添加的事件类型],fn[事件发生的执行函数])
         removeEvent1:removeEvent1, 与添加事件相对应
         addEvent2:addevent2,    三个参数(element[添加事件的元素],type[添加的事件类型],handle[事件发生的执行函数])
         removeEvent2:removeevent,
         hasFlash:hasFlash,      检查浏览器是否支持Flash，直接调用即可
         hasQt:hasQt,            检查浏览器是否支持QuickTime，直接调用即可
         createTable:createTable,两个参数(row[行],col[列])   动态添加表格
                                  默认表格内部内容为乘法口诀
         Ajax:Ajax               四个参数(method[请求方法],url[请求地址],data[请求数据],success[成功的回调函数])
 */



var fun=(function () {

    function getStyle1(elem,name){
        //属性存在，且已经被设置
        if(elem.style[name]){
            return elem.style[name];

            //否则尝试使用IE的方法
        }else if(elem.currentStyle){
            return elem.currentStyle;
        }else if(document.defaultView && document.defaultView.getComputedStyle){
            //它使用的是通用的“text-align”的样式规则而不是“textAlign”
            name=name.replace(/([A-Z])/g,"-S1");
            name=name.toLowerCase();

            //获取样式对象并获取属性（存在的话）值

            var s=document.defaultView.getComputedStyle(elem,"");
            return s && s.getPropertyValue(name);

            //否则，用户使用的是其他的浏览器
        }else{
            return null;
        }
    }


    function getStyle2(obj,attr){

        //IE 浏览器
        if(obj.currentStyle){
            return obj.currentStyle[attr];
            //火狐浏览器
        }else{
            return getComputedStyle(obj,false)[attr];
        }
    }

    function getClass1(name,type){
        var r=[];
        //建立正则表达式检索指定 name 的class
        var re=new RegExp("(^|\\s)"+name+"(^|\\s)");
        var e=document.getElementsByTagName(type||"*");

        for (var j=0;j< e.length;j++){
            if(re.test(e[j]))
                r.push(e[j])
        }
        return r;
    }
    function getClass2(parent,cls){
        var res = [];
        var reg = new RegExp('(^|\\s)' + cls + '($|\\s)', 'i');
        var ele = parent.getElementsByTagName('*');
        for(var i = 0; i < ele.length; i++){
            if(reg.test(ele[i].className)){
                res.push(ele[i]);
            }
        }
        return res;
    }
    function addEvent1(elem,type,fn){
        if(elem.addEventListener){
            elem.addEventListener(type,fn,false);
        }else if(elem.attachEvent){
            elem.attachEvent("on"+type,fn)
        }else{
            elem["on"+type]=null;
        }
    }

    function removeEvent1(elem,type,fn){
        if(elem.removeEventListener){
            elem.removeEventListener(type,fn,false);
        }else if(elem.detachEvent){
            elem.detachEvent("on"+type,fn)
        }else{
            elem["on"+type]=null;
        }
    }

    function addevent2(element,type,handle){

        //为每个事件处理函数赋予一个独立的ID

        if(!handle.$$guid) handle.$$guid=addevent.guid++;


        //为元素建立一个事件类型的散列表

        if(!element.events) element.events={};

        //为每个元素/事件简历一个事件处理函数的散列表

        if(!handle){
            handle=element.events[type]={};

            //存储已经有的事件处理函数
            if(element["on"+type]){
                handle[0]=element["on"+type];
            }
        }
        //在散列表中存储该事件的处理函数
        handle[handle.$$guid]=handle;

        //赋予一个全局事件处理函数来处理所有工作
        element["on"+type]=handleEvent;
    };

    addevent2.guid=1;
    function removeevent(element,type,handle){
        //从散列表中删除事件处理函数
        if(element.events && element.events[type]){
            delete  element.events[type][handle.$$guid];
        }
    };

    function handleEvent(){
        var returnValue=true;

        //获取事件对象（IE）
        event =event||window.event;

        //获取事件处理函数散列表的引用

        var handles=this.events[event.type];

        //依次执行每个事件函数

        for(var i in handles){
            this.$$handleEvent=handles[i];
            if(this.$$handleEvent(event)===false){
                returnValue=false;
            }
        }
        return returnValue;
    }

    function fixEvent(event){
        event.preventDefault=fixEvent.preventDefault;
        event.stopPropagation=fixEvent.stopPropagation;
        return event;
    };

    fixEvent.preventDefault=function(){
        this.returnValue=false;
    };
    fixEvent.stopPropagation=function(){
        this.returnValue=false;
    };

    function Qhasp(name){
        name=name.toLocaleLowerCase();
        for(var i=0;i<navigator.plugins.length;i++){
            if(navigator.plugins[i].name.toLowerCase().indexOf(name)>-1){
                return true;
            }
        }
        return false;
    }
    function Ihasp(name){
        try{
            new ActiveXObject(name)
            return true;
        }catch(ex){
            return false;
        }
    }
    function hasFlash(){
        var result=Qhasp("Flash");
        if(! result){
            result=Ihasp("ShockwaveFlash.ShockwaveFlash");
        }
        return result;

    }

    function hasQt(){
        var result=this.hasplugins.pMethod.Qhasp("QuickTime");
        if(! result){
            result=this.hasplugins.pMethod.Ihasp("Quick.Quick");
        }
        return result;
    }


    function createTable(row,col){
        var table=document.createElement("table");
        table.border=1;
        table.width="100%";

        var tbody=document.createElement("tbody");
        table.appendChild(tbody);
        for(var i=0;i<row;i++){
            tbody.insertRow(i);
            for(var j=0;j<col;j++){
                tbody.rows[i].insertCell(j);
                tbody.rows[i].cells[j].appendChild(document.createTextNode(i+1+"*"+(j+1)));
            }

        }
        return table;
    }

    function Ajax(method,url,data,success) {
        var xhr=null;
        if(window.XMLHttoRequest){
            xhr=new XMLHttpRequest();
        }else{
            xhr=new ActiveXObject('Microsoft.XMLHTTP');
        }
        /*
         * 另外一种方式
         * try{
         *   XHR=new XMLHttpRequest;
         * }catch(e){
         *   XHR=new ActiveObject('Microsoft.XMLHTTP');
         * }
         * */
        if(method=='get' && data){
            url+='?'+data+new Date().getTime();
            xhr.open(method,url,true);
            xhr.send(null);
        }
        if(method='post' && data){
            xhr.setRequestHeader('content-type:text/html,charset:utf-8');
            xhr.oped(method,url,true);
            xhr.send(deta);
        }

        xhr.onreadystatechange=function () {
            if(xhr.readyState==4){
                if((xhr.status>=200)&&(xhr.status<300)||xhr.status==304){
                    success && success(xhr.responseText);
                }else{
                    throw ('Error'+xhr.status);
                }
            }
        }
    }
    return{
        getStyle1:getStyle1,
        getStyle2:getStyle2,
        getClass1:getClass1,
        getClass2:getClass2,
        addEvent1:addEvent1,
        removeEvent1:removeEvent1,
        addEvent2:addevent2,
        removeEvent2:removeevent,
        hasFlash:hasFlash,
        hasQt:hasQt,
        createTable:createTable,
        Ajax:Ajax
    }
})();