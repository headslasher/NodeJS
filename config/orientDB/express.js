module.exports = () =>{
  const app = require('express')();//express

  const session = require('express-session');//session
  const FileStore = require('session-file-store')(session);//session을 파일형태저장
  const OrientoStore = require('connect-oriento')(session);//session을 orient에저장
  const bodyparser = require('body-parser');//body form 태그 정보 파싱
  
  app.use(bodyparser.urlencoded({extended:false}));

  app.set('views','./views/orientDB');//pug 템플릿
  app.set('view engine','pug');//pug 템플릿 폴더, 확장자 지정

  app.use(session({//orient접속 session정보
  	secret:'13r133tw3tr#R!#',
    resave: false,
    saveUninitialized: true,
    store: new OrientoStore({
      server : 'host=localhost&port=2424&username=root&password=password&db=demodb'
    })
  }));

  return app;
};
