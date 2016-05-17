webSmock

`websmock` is built by giving express http server, you can set up multiple vhost simple configuration. `websmock` combines the `handlebars`, `mockjs`, widget. Let mock test data easier. If the back-end using the template engine `handlebars`, front and rear ends to achieve the perfect separation


##demo

####Create base directory
```
>mkdir nodeapp
>websmock -c demo
>websmock -c demo1
>vim app.js
```

####Create app.js (config)
```
var path = require('path');

var config = [
    {
        host: 'test.demo.com',
        path: path.join(__dirname, 'demo')

    },
    {
        host: 'test.demo1.com',
        path: path.join(__dirname, 'demo1')
    }

];


module.exports = config;

```

####start
```
 |--- demo
 |--- demo1
 |--- app.js
```

`websmock --start or websmock -s`

http://test.demo.com:3000
http://test.demo1.com:3000

