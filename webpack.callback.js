const { exec } = require('child_process');

module.exports = function () {
    exec("export VAGRANT_CWD='~/sites/processmaker' && \
          vagrant ssh -c 'php processmaker/artisan vendor:publish \
          --tag=api-connector \
          --force'",
        (err, stdout, stderr) => {
            if (!err) {
                console.log("\n" + stdout);
            } else {
                console.log(err);
            }
        });
};
