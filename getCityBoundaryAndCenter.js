const fs = require('fs');
const path = require('path');

/**
 * 获取城市边界和中心点
 * 
 */
var baseUri = './data'
var filePath = path.resolve(baseUri);
var cityList = {};


function readText(pathname) {
    var bin = fs.readFileSync(pathname);

    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
        bin = bin.slice(3);
    }

    return bin.toString('utf-8');
}


var _getBound = (name, limit_point) => {
    var _Boundary = new BMap.Boundary();
    _Boundary.get(name, function (rs) { //获取行政区域边界
        var count = rs.boundaries.length; //行政区域的点有多少个
        //经纬度范围
        var maxLat = -90,
            maxLng = -180,
            minLat = 90,
            minLng = 180;

        for (var i = 0; i < count; i++) {

            var _points = rs.boundaries[i].split(';');
            var _poingList = [];

            _points.forEach(item => {
                var _point = item.split(',');
                _point[1] = _point[1].trim();
                _poingList.push({ lng: _point[0], lat: _point[1] });
                if (item) {
                    if (maxLng < _point[0]) {
                        maxLng = _point[0];
                    }
                    if (maxLat < _point[1]) {
                        maxLat = _point[1];
                    }
                    if (minLng > _point[0]) {
                        minLng = _point[0];
                    }
                    if (minLat > _point[1]) {
                        minLat = _point[1];
                    }
                }
            });

            limit_point[name] = { minLng, minLat, maxLng, maxLat };

        }
    });
}

fs.readdir(filePath, function (err, files) {
    files.forEach(element => {
        if (element) {
            try {
                var limit_point;
                var data = JSON.parse(readText(`${baseUri}/${element}`).toString('utf-8'))
                var name = element.replace('.json','');
                if(Number.isInteger(parseInt(name))){  //需要获取的数据
                    data.features[0][0].geometry.coordinates[0].forEach(item => {
                        _getBound(item, limit_point)
                    })
                    cityList[data.properties.name] = limit_point
                }
                //console.log( data.features[0])
                

            } catch (e) {
                console.log(e)
            }
        }
    });

    cityList
    console.log(cityList);

})


