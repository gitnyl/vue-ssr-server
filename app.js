const express = require("express");
const { createBundleRenderer } = require("vue-server-renderer");

// store를 가져옵니다.
const store = require("./src/store");

const app = express();

app.use(express.json());
app.use(express.static('./public'));

// SSR 관련 코드
// SSR로 만들어진 html이 <!--vue-ssr-outlet--> 위치에 삽입됩니다.
const template = `
  <!DOCTYPE html>
  <html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Vue Simple SSR</title>
  </head>
  <body>
  <!--vue-ssr-outlet-->
  </body>
  </html>
`;
const ssrBundle = require('./public/vue-ssr-server-bundle.json');
const clientManifest = require('./public/vue-ssr-client-manifest.json');
const renderer = createBundleRenderer(ssrBundle, { template, clientManifest });

// request body를 받아올 수 있도록 미들웨어를 등록합니다.
app.use(express.json());

// // error handling ???????
// app.get("*", function(req, res, next)) => {
//     throw new Error('err!!!!!!!!!')
// }

// store의 state를 가져오는 endpoint
app.get("/api/state", (req, res) => {
    res.json(store.state);
})

// store의 state를 업데이트하는 endpoint
app.put("/api/state", (req, res) => {
    store.setState(req.body);
    res.status(204).send();
})

app.get("/*", async ({ url }, res) => {
    // context에 state를 넘겨줄 수 있도록 합니다.
    const { state } = store;
    res.send(await renderer.renderToString({ url, state }));
});

app.listen(3000, () => {
    console.log('listen to http://localhost:3000')
});