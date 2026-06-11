import { NodeSSH } from 'node-ssh';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { listParseToJson } from './paser.js';

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

        return result;
    } catch (error) {
        console.error('Erreur SSH:', error);
        throw error;
    } finally {
        ssh.dispose();
    }
}
const action = [
    {
        name: 'list',
        command: 'ls -lo',
        describe: 'liste tous les fichiers du répertoire courant',
        parse: listParseToJson
    },
    {
        name: 'docker',
        command: 'docker ps',
        describe: 'liste tous les conteneurs Docker en cours d\'exécution'
    },
    {
        name: 'update',
        command: `echo ${process.env.SSH_PASSWORD} | sudo -S apt update && echo ${process.env.SSH_PASSWORD} |sudo -S apt upgrade -y`,
        describe: 'met à jour les paquets du système'
    }
]


app.post('/api/action', async (req, res) => {
    const { actionName } = req.body;
    console.log('Action Name:', actionName);
    const actionToExecute = action.find(a => a.name === actionName);
    if (!actionToExecute) {
        return res.status(400).json({ error: 'Action non trouvée' });
    }
    try {
        const result = await excuteCommande(actionToExecute.command);
        let data = result.stdout;


        if (actionToExecute.parse) {
            data = actionToExecute.parse(result.stdout);
        }

        res.json({
            message: 'Commande exécutée avec succès',
            data,
            stderr: result.stderr
        });

    } catch (error) {
        console.error('Erreur lors de l\'exécution de la commande:', error);
        res.status(500).json({ error: 'Erreur lors de l\'exécution de la commande' });
    }

});


app.listen(process.env.PORT_APP, () => {
    console.log('Server is running on port ' + process.env.PORT_APP);
});
