const { createBundleRenderer } = require("vue-server-renderer");
const fs = require('fs');
const { join } = require('path');

// csr과 ssr에 사용되는 template의 경로를 정의합니다.
const ssrTemplatePath = join(process.cwd(), 'template/ssr_index.html');
const csrTemplatePath = join(process.cwd(), 'template/index.html');

// ssr template을 읽어옵니다.
const template = fs.readFileSync(ssrTemplatePath, 'utf-8');

// csr template을 읽어옵니다.
const csrTemplate = fs.readFileSync(csrTemplatePath, 'utf-8');

// renderer를 정의합니다.
const bundle = require("../public/vue-ssr-server-bundle.json");
const clientManifest = require("../public/vue-ssr-client-manifest.json");
const renderer = createBundleRenderer(bundle, { clientManifest, template });

module.exports = {
    async getHtml (context) {
        try {
            return await renderer.renderToString(context);
        } catch (e) {
            // ssr이 정상적으로 이루어지지 않았을때, 즉 오류가 있을 땐 csr을 할 수 있도록 합니다.
            return csrTemplate;
        }
    }
}