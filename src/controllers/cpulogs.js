import { Router } from 'express';
import { exec } from 'child_process';
import os from 'os';
import PDFDocument from "pdfkit-table";
import fs from 'fs';
import path from 'path';


const cpulogsApi = Router();

cpulogsApi.get("/", async (req, res) => {
    exec('last', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        // console.log(`stdout: ${stdout}`);
        // console.log(stdout); Change by  Rahul to not show all CPU log again and again
        console.log("CPU Logs but clicked"); 

        const responses = [];
        const user = os.userInfo().username;
        const output = stdout;
        const lines = output.split('\n');

        let currentReason = '';
        lines.forEach(line => {
            if (line.startsWith(os.userInfo().username)) {
                const parts = line.split(/\s+/);
                currentReason = parts.slice(3).join(' ');
            } else if (line.startsWith('reboot')) {
                const parts = line.split(/\s+/);
                const timing = parts[parts.length - 3] + ' ' + parts[parts.length - 2] + ' ' + parts[parts.length - 1];
                responses.push({
                    timing,
                    reason: currentReason
                });
            }
        });
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = ("0" + date_ob.getHours()).slice(-2);
        let minutes = ("0" + (date_ob.getMinutes())).slice(-2);
        let seconds = ("0" + (date_ob.getSeconds())).slice(-2);
        var dateObj = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
        var datetime = JSON.stringify(dateObj);
        const doc = new PDFDocument();
        const data = Object.values(responses);
        let a_list = [];
        let k;
        for (var i = 0; i < responses.length; i++) {
            var value1 = Object.values(responses[i]);
            k = [i + 1, value1];


            // console.log(value1);
            a_list.push(k);
        }
        // console.log(a_list, "a_list");

        const table = {
            title: "\n                                             System_Logs",
            headers: ["S.no", "Date/Time"],
            rows: a_list,
        };

        const downloadPath = path.join(process.env.HOME, 'Downloads', 'cpulogs+' + datetime + '.pdf');

        // console.log(table, "table");

        doc.table(table, { width: 450 });
        // doc.pipe(fs.createWriteStream('./Cpulogs/' + 'cpulogs+' + datetime + '.pdf'));
        // doc.pipe(fs.createWriteStream(downloadPath));

        doc.text('Cpu logs');
        doc.end();
        res.json({ message: "Cpu logs retrieved successfully!", payload: responses, user: user });
    })
})
// Add CORS headers
cpulogsApi.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
export default cpulogsApi;






