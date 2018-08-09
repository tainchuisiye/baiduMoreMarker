const fs = require('fs');
const path = require('path');
const http = require('http');


/**
 * 收集省份仅为度中心点
 */
var data =JSON.parse(fs.readFileSync('./app/data/china.json', 'utf-8'));  //读取

var cityList = {};
data.features.forEach(element => {
    var {cp:point,name}= element.properties;
    var specialCity = ['上海','重庆','北京','天津']
    var specialProvide = ['西藏','内蒙古','广西','新疆','宁夏']

    if(specialCity.indexOf(name)!==-1){
        name +=`市`
    }else if(specialProvide.indexOf(name)!==-1){
        switch(name){
            case'西藏':name='西藏自治区';break;
            case'新疆':name='新疆维吾尔自治区';break;
            case'广西':name='广西壮族自治区';break;
            case'宁夏':name='宁夏回族自治区';break;
            case'内蒙古':name='内蒙古自治区';break;
        }
    }else{
        name +=`省`;
    }
    cityList[name] = {lng:point[0],lat:point[1]}
    //cityList.push({point,name})
});
var provider = JSON.stringify({city:cityList})
fs.writeFileSync('./city.json',provider) //写入
console.log(cityList)



