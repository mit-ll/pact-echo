const util = require('util');
const exec = util.promisify(require('child_process').exec);


const get_hci0_mac = async () => {
    var data = {};
    const { stdout } = await exec("hcitool dev");
    const lines = stdout.split('\n');
    const re = /hci0/;
    const mac = /[a-fA-F0-9:]{17}|[a-fA-F0-9]{12}$/g;
    for (var i=0;i<lines.length;i++) {
        if(re.test(lines[i])) {
            const e = mac.exec(lines[i]);
            console.log('Addr: %s', e[0]);
            const colToDash=/\:/g;
            console.log('Imp: %s', e[0].replace(colToDash,'-'));
        }
    }
}

get_hci0_mac();