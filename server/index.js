import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // per fare richieste

const app = express();
app.use(cors()); // abilita CORS per il tuo server

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Crea un endpoint proxy per l'OAuth
app.post('/api/oauth', async (req, res) => {
    const body = req.body;
    console.log(body);
    try {
        const response = await fetch(`https://accounts.zoho.${body.location}/oauth/v2/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: body.client_id,
                client_secret: body.client_secret,
                redirect_uri: body.redirect_uri,
                code: body.code,
            }).toString(),
        }).then(res => res.json());
        console.log(response);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/request', async (req, res) => {
    const body = req.body;
    console.log(body);
    try {
        const access_token = await fetch(`https://accounts.zoho.${body.location}/oauth/v2/token?refresh_token=${body.refreshToken}&client_id=${body.client_id}&client_secret=${body.client_secret}&grant_type=refresh_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
            .then(data => {
                console.log(data.access_token)
                return data.access_token;
            });
        console.log(access_token);
        if (access_token) {
            const options = {
                method: body.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Zoho-oauthtoken ${access_token}`,
                },
            }
            if (body.method !== 'GET') options.body = JSON.stringify({
                data: body.data,
            })
            const response = await fetch(body.url, options).then(res => res.json())
            console.log(response);
            res.status(200).json(response);
        } else {
            console.log('error');
            res.status(403).json({ error: 'Forbidden' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
