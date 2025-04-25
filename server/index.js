import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // per fare richieste

const app = express();
app.use(cors()); // abilita CORS per il tuo server

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Crea un endpoint proxy per l'OAuth
app.post("/api/oauth", async (req, res) => {
  const body = req.body;
  console.log(body);
  try {
    const response = await fetch(
      `https://accounts.zoho.${body.location}/oauth/v2/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: body.grant_type,
          client_id: body.client_id,
          client_secret: body.client_secret,
          redirect_uri: body.redirect_uri,
          code: body.code,
        }).toString(),
      }
    )
      .then((res) => {
        console.log("res status", res.status);
        return getResponse(res);
      })
      .catch((err) => {
        console.log("ERROR:", err);
        return { status: 500, error: "Internal Server Error" };
      });
    console.log(response);
    if (response.error) {
      console.log("error", response.error);
      res.status(response.status).json({ error: response.error });
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/request", async (req, res) => {
  const body = req.body;
  console.log(body);
  try {
    const access_token = await fetch(
      `https://accounts.zoho.${body.location}/oauth/v2/token?refresh_token=${body.refreshToken}&client_id=${body.client_id}&client_secret=${body.client_secret}&grant_type=refresh_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        console.log("fetch access token status", res.status);
        return getResponse(res);
      })
      .catch((err) => {
        console.log("ERROR:", err);
        return { status: 500, error: "Internal Server Error" };
      })
      .then((data) => {
        if (data.error) {
          console.log("error", data.error);
          res.status(data.status).json({ error: data.error });
        }
        return data?.access_token || null;
      });
    console.log("access_token", access_token);
    if (access_token) {
      const options = {
        method: body.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      };
      if (body.method !== "GET")
        options.body = JSON.stringify({
          data: body.data,
        });
      const response = await fetch(body.url, options)
        .then((res) => {
          console.log("fetch status", res.status);
          return getResponse(res);
        })
        .catch((err) => {
          console.log("ERROR:", err);
          return { status: 500, error: "Internal Server Error" };
        });
      console.log(response);
      if (response.error) {
        console.log("error", response.error);
        res.status(response.status).json({ error: response.error });
        return;
      }
      res.status(200).json(response);
    } else if (access_token?.error) {
      console.log("error", access_token.error);
      res.status(access_token.status).json({ error: access_token.error });
    } else {
      console.log("error");
      res.status(403).json({ error: "Forbidden" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function getResponse(res) {
    if (res.status === 204) {
      return { status: res.status, warning: "No Content" };
    }
    if (res.status === 400) {
      return { status: res.status, error: "Bad Request" };
    }
    if (res.status === 401) {
      return {
        status: res.status,
        error: "Unauthorized",
      };
    }
    if (res.status === 403) {
      return { status: res.status, error: "Forbidden" };
    }
    if (res.status === 404) {
      return { status: res.status, error: "Not Found" };
    }
    if (res.status === 408) {
      return { status: res.status, error: "Request Timeout" };
    }
    if (res.status === 429) {
      return { status: res.status, error: "Too Many Requests" };
    }
    if (res.status === 500) {
      return { status: res.status, error: "Internal Server Error" };
    }
    if (res.status === 503) {
      return { status: res.status, error: "Service Unavailable" };
    }
    if (res.status === 504) {
      return { status: res.status, error: "Gateway Timeout" };
    }
    return res.json();
}