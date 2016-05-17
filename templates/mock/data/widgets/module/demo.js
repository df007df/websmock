var Mock = require('mockjs');

exports.data = function () {


    var data = Mock.mock({
        "list|3": [{
            "name": '@name',
            "age|1-100": 100,
            "color": '@color'
        }]
    });

    //console.log(JSON.stringify(data, null, 4));


    return data;
};
