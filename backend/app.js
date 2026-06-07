import { NodeSSH } from 'node-ssh';

import dotenv from 'dotenv';
dotenv.config();
const ssh = new NodeSSH();

const test = 'ls -lo';
const test2 = 'docker ps';


async function excuteCommande(commande) {
    try {
        await ssh.connect({
            host: process.env.SSH_HOST,
            username: process.env.SSH_USERNAME,
            password: process.env.SSH_PASSWORD

        });

        const result = await ssh.execCommand(commande);

        console.log('STDOUT:', result.stdout);
        console.log('STDERR:', result.stderr);

        ssh.dispose();
    } catch (error) {
        console.error('Erreur SSH:', error);
    }
}

await excuteCommande(test);
await excuteCommande(test2);
console.log('hostname : ' + process.env.SSH_HOST);
console.log('username : ' + process.env.SSH_USERNAME);
console.log('password : ' + process.env.SSH_PASSWORD);