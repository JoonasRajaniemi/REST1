const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const filePath = 'sanakirja.txt';

app.use(express.json());

app.get('/hae/:suomi', (req, res) => {
    const suomiSana = req.params.suomi;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Virhe sanakirjan lukemisessa' });
        }

        const lines = data.split('\n');
        for (const line of lines) {
            const [suomi, englanti] = line.split(' ');
            if (suomi === suomiSana) {
                return res.json({Englanti: englanti });
            }
        }
        res.status(404).json({ error: 'Sanaa ei löydy sanakirjasta' });
    });
});

app.post('/lisaa', (req, res) => {
    const { suomi, englanti } = req.body;

    if (!suomi || !englanti) {
        return res.status(400).json({ error: 'Sanoja ei ole määritelty oikein' });
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Virhe sanakirjan lukemisessa' });
        }

        const lines = data.split('\n');
        for (const line of lines) {
            const [existingSuomi] = line.split(' ');
            if (existingSuomi === suomi) {
                return res.status(409).json({ error: 'Suomenkielinen sana on jo sanakirjassa' });
            }
        }

        const newEntry = `${suomi} ${englanti}\n`;
        fs.appendFile(filePath, newEntry, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Virhe sanaparin lisäämisessä' });
            }
            res.status(201).json({ message: 'Sanapari lisätty onnistuneesti', suomi, englanti });
        });
    });
});

app.listen(port, () => {
    console.log(`Palvelin käynnissä osoitteessa http://localhost:${port}`);
});