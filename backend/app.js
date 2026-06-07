import { NodeSSH } from 'node-ssh';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { describe } from 'vitest';

const app = express();
app.use(bodyParser.json());
app.use(cors());
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
const action = [
    {
        name: 'list',
        command: 'ls -lo',
        describe: 'liste tous les fichiers du répertoire courant'
    },
    {
        name: 'docker',
        command: 'docker ps',
        describe: 'liste tous les conteneurs Docker en cours d\'exécution'
    }
]


app.post('/api/action', async (req, res) => {
    const { actionName } = req.body;
    console.log('Action Name:', actionName);
    
});


app.listen(process.env.PORT_APP, () => {
    console.log('Server is running on port ' + process.env.PORT_APP);
});