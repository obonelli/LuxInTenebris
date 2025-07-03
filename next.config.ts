const path = require('path');
module.exports = {
    webpack(config: { resolve: { alias: any; }; }) {
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            './pdf.worker.js': path.resolve(__dirname, 'src/utils/pdfWorkerStub.js'),
            canvas: false,                   // seguimos evitando nativos
        };
        return config;
    },
};
