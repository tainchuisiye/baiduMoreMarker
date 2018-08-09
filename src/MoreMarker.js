/**
 * @fileoverview MoreMarker 基于百度聚合器MarkerClusterer用来解决加载大量点到地图聚合计算时间长、页面卡死的现象。
 * 基于Baidu Map API 1.2。
 * 
 * @author zhc
 * @version 1.0
 */

/**
 * @namespace  参考百度图地图的写法，BMap的所有library类均放在BMapLib命名空间下
 */
var BMapLib = window.BMapLib = BMapLib || {};
(function(){
    BMapLib.MoreMarker = function(map, options){
        if (!map){
            console.log('not map object in the first argument')
            return;
        }
        this._map = map;
        this._clusters = [];

        var opts = options || {};

        var {provinceCenter,provinceBound,cityBound,cityCenter,data,getBoundCall} = opts;
        this._provinceBound = provinceBound;   //省级边界
        this._provinceCenter= provinceCenter;  //省级中心点
        this._cityBound = cityBound;           //市级边界
        this._cityCenter= cityCenter;          //市级中心点

        //入参无边界值和中心点，否则根据原始的数据中重新请求
        if(!provinceBound &&　!provinceCenter && !cityBound && !cityCenter){
            getCityCenterAndBound(data,getBoundCall)
        }

    

        this._oldZoom = map.getZoom();          //记录缩放之前的zoom

        this._drawCityed = {  
            markers: {},             //MarkerClusterer对象中已有的marker覆盖物，如：{"福州":[marker]}
            drawCityName: new Set()  //地图已画的城市名
        };
 
        var countPoint = {},
        cityCountPoint = {},
    
    };


/**
 * getCityCenterAndBoundForbaidu
 * 根据数据中已有城市获取城市的中心点以及边界经纬度数据  --百度
 * @param {array} cityList  需要展示的原始数据['省','市','区',{lng,lat}]
 * @param {function}  callback 
 */
MoreMarker.prototype.getCityCenterAndBound = (cityList,callback) => {

    var _cityList = new Set(); //set快速去重

    var _cb = ({bound, center, name, index}) => {

        cityCenter[name] = center;
        boundary[name] = bound;

        if(typeof callback==='function'){
            callback({bound, center, name, index})
        }

        if (index === _array.length - 1) {
            console.log(JSON.stringify(boundary));
            console.log(JSON.stringify(cityCenter));
        }
    }

    cityList.forEach(item => {
        if (item[1]) {
             _cityList.add(item[1])
        }
    });

   const _array = Array.from(_cityList); //转数组
   _array.forEach((_name, _index) => {
       _getBound(_name, _cb, _index);
    })
}

/**
 * _getProvideBoundSimple 获取哪些省份/市区包含可视范围（简单版）
 * 省份定点组成的矩形判断获取的可视范围是否某个顶点包含在里面
 * 未做处理：在省份边界的矩形内，但并不在实际的省份
 * 
 * 注意：地图zoom的等级
 * 8.9 添加可视区域反向包含
 * @param {object} map  地图对象
 * @param {object} boundArea  行政区边界
 *
 */
MoreMarker.prototype._getProvideBoundSimple=(map, boundArea)=> {
    var _bounds = cutBoundsInRange(map.getBounds());
    var _coverProvide = [];

    for (const key in boundArea) {
        if (boundArea.hasOwnProperty(key) && Object.keys(boundArea[key]).length === 4) {
            var {minLat, minLng, maxLng, maxLat} = boundArea[key]; //省份边界值
            var {He, Le, Vd, Xd} = _bounds; // 可视区域 lng ：max(HE)/min(Le)  ; lat ：max(Vd)/min(Xd)

            if (minLat < Xd && minLng < Le && maxLat > Vd && maxLng > He) { //可视区域所有的点在省份内
                _coverProvide.push(key);
            } else if (minLat < Xd && minLng < Le && maxLat > Xd && maxLng > Le ||
                 minLat < Xd && minLng < He && maxLat > Xd && maxLng > He || 
                 minLat < Vd && minLng < Le && maxLat > Vd && maxLng > Le || 
                 minLat < Vd && minLng < He && maxLat > Vd && maxLng > He) { // 可视区域四个顶点中的某个顶点
                _coverProvide.push(key);
            }else if(minLat > Xd && minLng > Le && maxLat < Vd && maxLng < He){  // 省份边界在可视区域内
                _coverProvide.push(key);
            }
        }
    }
    return _coverProvide;
}


})()


var styleOptions = {
    strokeColor: "#933", //边线颜色。
    fillColor: "#345", //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 2, //边线的宽度，以像素为单位。
    strokeOpacity: 0.5, //边线透明度，取值范围0 - 1。
    fillOpacity: 0.3, //填充的透明度，取值范围0 - 1。
    strokeStyle: 'dashed' //边线的样式，solid或dashed。
}

// 复杂的自定义覆盖物
function ComplexCustomOverlay(point, text, mouseoverText) {
    this._point = point;
    this._text = text;
    this._overText = mouseoverText;
}
ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function (map) {
    this._map = map;
    var div = this._div = document.createElement("div");
    div.style.position = "absolute";
    // div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    div.style.backgroundColor = "#EE5D5B";
    div.style.border = "1px solid #BC3B3A";
    div.style.color = "white";
    div.style.height = "18px";
    div.style.padding = "2px";
    div.style.lineHeight = "18px";
    div.style.whiteSpace = "nowrap";
    div.style.MozUserSelect = "none";
    div.style.fontSize = "12px"
    var span = this._span = document.createElement("span");
    div.appendChild(span);
    span.appendChild(document.createTextNode(this._text));
    var that = this;

    var arrow = this._arrow = document.createElement("div");
    arrow.style.background = "url(http://map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png)" +
            " no-repeat";
    arrow.style.position = "absolute";
    arrow.style.width = "11px";
    arrow.style.height = "10px";
    arrow.style.top = "22px";
    arrow.style.left = "10px";
    arrow.style.overflow = "hidden";
    div.appendChild(arrow);

    div.onmouseover = function () {
        this.style.backgroundColor = "#6BADCA";
        this.style.borderColor = "#0000ff";
        this.getElementsByTagName("span")[0].innerHTML = that._overText;
        arrow.style.backgroundPosition = "0px -20px";
    }

    div.onmouseout = function () {
        this.style.backgroundColor = "#EE5D5B";
        this.style.borderColor = "#BC3B3A";
        this.getElementsByTagName("span")[0].innerHTML = that._text;
        arrow.style.backgroundPosition = "0px 0px";
    }

    map
        .getPanes()
        .labelPane
        .appendChild(div);

    return div;
}
ComplexCustomOverlay.prototype.draw = function () {
    var map = this._map;
   
    try{
        var pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
        this._div.style.top = pixel.y - 30 + "px";
    }catch(e){
        console.log(this._point)
    }
    
   
}


/**
 * [MarkerClusterer 聚合点]
 * @param {object} map  地图对象
 * @param {array} markers marker list
 */
function MarkerClusterer(map,markers) {
    if (Object.keys(markerClusterer).length === 0) { //如果为空，实例化聚合对象
        markerClusterer = new BMapLib.MarkerClusterer(map, { markers:markers });
        markerClusterer.setMaxZoom(16 - 1);
        markerClusterer.setGridSize(100);
        markerClusterer.isAverageCenter(true);
        markerClusterer.setMinClusterSize(2);
    } else {
        markerClusterer.addMarkers(markers);
        markerClusterer._redraw(); //重新画聚合覆盖物
    }
}

/**
 *  清除聚合
 * @param {object} clusterObj  聚合对象
 * @param {array} markerArr  可选，如果为空，清除聚合对象中所有的marker对象
 */
function clearClusterer(clusterObj,markerArr) {
    if(Object.keys(clusterObj).length !== 0){
        if (!markerArr) {
            markerArr = clusterObj.getMarkers();
            clusterObj.removeMarkers(markerArr); 
            clusterObj={};
        }else{
            clusterObj.removeMarkers(markerArr); 
        }
      
    }
}


// ------------------------------factory

/**
     * 对单个值进行边界处理。
     * @param {Number} i 要处理的数值
     * @param {Number} min 下边界值
     * @param {Number} max 上边界值
     *
     * @return {Number} 返回不越界的数值
     */
var getRange = function (i, mix, max) {
    mix && (i = Math.max(i, mix));
    max && (i = Math.min(i, max));
    return i;
};

/**
     * 按照百度地图支持的世界范围对bounds进行边界处理
     * @param {BMap.Bounds} bounds BMap.Bounds的实例化对象
     *
     * @return {BMap.Bounds} 返回不越界的视图范围
     */
var cutBoundsInRange = function (bounds) {
    var maxX = getRange(bounds.getNorthEast().lng, -180, 180);
    var minX = getRange(bounds.getSouthWest().lng, -180, 180);
    var maxY = getRange(bounds.getNorthEast().lat, -74, 74);
    var minY = getRange(bounds.getSouthWest().lat, -74, 74);
    return new BMap.Bounds(new BMap.Point(minX, minY), new BMap.Point(maxX, maxY));
};



/**
 * 重新绘制地图
 * 1.清除所有覆盖物
 * 2.获取可视区域地图中包含的区域
 * 3.使用可见区域数据绘制
 *
 * @param {*} map  地图对象
 *
 */
var _reDraw = (map) => {}

    /**
* 根据地缩放图等级做相应的操作
* Zoom 1-6 覆盖物按省份划分
* Zoom 7-9 覆盖物按市级划分
* Zoom 10-21 按车辆覆盖物展示
*
* @param {*} map
*/
    function _zoomLevel(map) {
        var _level = map.getZoom(),list=[];

        if (_level <= 6) {
            if (oldZoom > 6) {
                map.clearOverlays();
                clearClusterer(markerClusterer);
                markerClusterer ={}
                for (const key in countPoint) {
                    var myCompOverlay = new ComplexCustomOverlay(cityCenter[key], `${key}${countPoint[key].count}辆车`, `${key}${countPoint[key].count}辆车`);
                    map.addOverlay(myCompOverlay);
                    list.push(new BMap.Marker(cityCenter[key]))
                }
            }
        } else if (_level >= 7 && _level <= 9) {
            if (oldZoom < 7 || oldZoom > 9) {
                map.clearOverlays();
                clearClusterer(markerClusterer);
                markerClusterer ={}
                for (const name in cityCountPoint) {
                    try {
                        if (Object.keys(cityCenter[name]).length > 0) {
                            var _text = `${name}${cityCountPoint[name].count}辆车`
                            var myCompOverlay = new ComplexCustomOverlay(cityCenter[name], _text, _text);
                            map.addOverlay(myCompOverlay);
                        }
                    } catch (e) {
                        console.log(e)
                    }

                }
            
            }

        } else {

            //首次清除覆盖物
            if (oldZoom < 10) {
                map.clearOverlays();
            }

            // console.time('计算省份时间');
            // _drawBound(countPoint);  //查看边界范围，校验包含的省份是否正确 var _provideNameList =
            // _getProvideBoundSimple(map,countPoint), //获取省份的边界
            var _bounds, size = 0,_centerPoint; //覆盖物个数，待删除

                if(_level<12){
                    _bounds = _getProvideBoundSimple(map,providerBound);//获取省份的边界
                    _centerPoint = countPoint
                }else{
                    _bounds = _getProvideBoundSimple(map, cityBound); //获取省份的边界 
                    _centerPoint = cityCountPoint
                }

                size = 0; //覆盖物个数，待删除
            // console.timeEnd('计算省份时间');
            // console.time('更新覆盖物时间');

            //删除当前不需要画的区域
            // console.time('删除覆盖物时间');
            for (const name of drawCityed.drawCityName) {
                if (new Set(_bounds).has(name) === false) {
                    //console.log('删除点：' + name)
                    drawCityed.drawCityName.delete(name)
                    clearClusterer(markerClusterer,drawCityed.markers[name])
                    delete  drawCityed.markers[name]
                }
            }
            // console.timeEnd('删除覆盖物时间');

            _bounds.forEach(name => {
                if (drawCityed.drawCityName.has(name)) { //过滤已经画的
                    return;
                } else {
                    drawCityed.drawCityName.add(name)
                    if (!drawCityed.markers[name]) {
                        drawCityed.markers[name] = [];
                    };

                    _centerPoint[name]
                        .pointlist
                        .forEach(({lng,lat}, index) => {
                            var _point = new BMap.Point(lng,lat)
                            drawCityed.markers[name].push(new BMap.Marker(_point))
        
                        })
                        MarkerClusterer(map,drawCityed.markers[name])
                    size += _centerPoint[name].pointlist.length
                    console.log(name+_centerPoint[name].pointlist.length)
                }

            })
            // console.timeEnd('更新覆盖物时间');
            console.log('更新覆盖物个数：' + size)
            console.log('覆盖物个数：' + map.getOverlays().length)

        }
        //回收
        oldZoom = _level

    }

    /**
 * 获得图形的中心点
 * @param {object} path
 */
    function _getCenterPoint(path) {
        var x = 0.0;
        var y = 0.0;
        for (var i = 0; i < path.length; i++) {
            x = x + parseFloat(path[i].lng);
            y = y + parseFloat(path[i].lat);
        }
        x = x / path.length;
        y = y / path.length;
        return new BMap.Point(x, y);
    }

    var _getBound = async(name, cb, index) => {
            var _Boundary = new BMap.Boundary();
            await _Boundary.get(name, function (rs) { //获取行政区域边界

                var count = rs.boundaries.length; //行政区域的点有多少个

                if (count === 0) {
                    console.log(name)
                    return;
                }

                if (typeof cb === 'function') {
                    //经纬度范围
                    var maxLat = -90,
                        maxLng = -180,
                        minLat = 90,
                        minLng = 180,
                        center,
                        limit_point = {};

                    for (var i = 0; i < count; i++) {

                        var _points = rs
                            .boundaries[i]
                            .split(';');
                        var _poingList = [];

                        _points.forEach(item => {
                            var _point = item.split(',');
                            _point[1] = _point[1].trim();
                            _poingList.push({lng: _point[0], lat: _point[1]});
                            if (item) { //边界值保存
                                minLng = Math.min(minLng, _point[0]);
                                maxLng = Math.max(maxLng, _point[0]);
                                maxLat = Math.max(maxLat, _point[1]);
                                minLat = Math.min(minLat, _point[1]);
                            }
                        });
                        center = _getCenterPoint(_poingList);
                        limit_point = {
                            minLng,
                            minLat,
                            maxLng,
                            maxLat
                        };

                    }
                    cb({bound: limit_point, center, name, index})
                } else {
                    var pointArray = [];
                    for (var i = 0; i < count; i++) {
                        var ply = new BMap.Polygon(rs.boundaries[i], {
                            strokeWeight: 2,
                            strokeColor: "#ff0000"
                        }); //建立多边形覆盖物
                        map.addOverlay(ply); //添加覆盖物
                        pointArray = pointArray.concat(ply.getPath());
                    }

                }

                // return {bound:limit_point,center}
            });
        }

        // ------------------------------factoryEnd

var countPoint = {},
    cityCountPoint = {},
    cityCenter = {},
    oldZoom,
    drawCityed = {
        markers: {},
        drawCityName: new Set() //地图已画城市名
    },
    boundary = {}, //存放边界点
    providerBound = {}, //存放省份边界点
    markerClusterer={},
    cityBound = {}; //存放省份边界点

     function getData() {
            await axios
                .get('./mook/pointDetial.json')
                .then(({data}) => {
                    //按区域划分点
                    var cityName = [],
                        pointList = [
                            [], []
                        ],
                        index;

                    var _getPoint = (info, row, type) => {
                        // var point = {     lng: Math.random() * 40 + 85,     lat: Math.random() * 30 +
                        // 21 }
                        if (!info[row[type]]) { //首次初始化对象
                            info[row[type]] = {
                                count: 0,
                                pointInfo: new Set([row[type+1]]),
                                pointlist: [row[3]]
                            }
                        }else{
                            var {pointlist,pointInfo,count} = info[row[type]];
                            pointlist.push(row[3]);
                            pointInfo.add(row[type+1]);
                            count +=1;
        
                            info[row[type]]={
                                pointlist,pointInfo,count
                            }
                        }

                    }

                    data
                        .list
                        .forEach((element) => {
                            _getPoint(countPoint, element, 0) //省

                            _getPoint(cityCountPoint, element, 1) //市
                        });
                });

            await axios
                .get('./mook/city.json')
                .then(({data}) => {
                    // 城市中心点
                    cityCenter = data.city;
                });
            await axios
                .get('./mook/cityCenter.json')
                .then(({data}) => {
                    // 城市中心点

                    cityCenter = {
                        ...cityCenter,
                        ...data
                    };

                });

            for (const key in countPoint) {
                
                try {
                    var myCompOverlay = new ComplexCustomOverlay(cityCenter[key], `${key}${countPoint[key].count}辆车`, `${key}${countPoint[key].count}辆车`);
                    map.addOverlay(myCompOverlay);
                    
                } catch (e) {
                    console.log(e)
                }

            }
               
            oldZoom = map.getZoom()

            axios
                .get('./mook/boundaryProvider.json')
                .then(({data}) => {
                    // 省级边界
                    providerBound = data
                });
            axios
                .get('./mook/cityBoundary.json')
                .then(({data}) => {
                    // 市级边界
                    cityBound = data
                })

            map.addEventListener("zoomend", function () {
                console.log(map.getZoom());
                _zoomLevel(map)

            });

            map.addEventListener("moveend", function () {
                // console.log(map.getZoom());
                _zoomLevel(map)
            })

        }

        //TODO:画边界，待删除
        function _drawBound(data, cb) {
            if (Object.keys(data).length > 0) {
                data = Object.keys(data)
            }
            data.forEach((item, index) => {
                _getBound(item, cb);
            })
        }



        /**
 * 初始化
 */
        function init() {
            getData();
            //getCityCenterAndBoundForbaidu();
        }
        init()
