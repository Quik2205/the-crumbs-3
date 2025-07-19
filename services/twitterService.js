require('dotenv').config();

const BEARER_TOKEN = process.env.BEARER_TOKEN;

async function obtenerTweets(usuario, limite = 3) {
  const headers = {
    'Authorization': `Bearer ${BEARER_TOKEN}`
  };

  try {
    if (!BEARER_TOKEN) {
      console.error("❌ No se detectó el BEARER_TOKEN. Revisa tu archivo .env");
      return { error: 'Token no definido' };
    }

    console.log("🔑 TOKEN USADO:", BEARER_TOKEN.slice(0, 10) + '...');

    const resUser = await fetch(`https://api.twitter.com/2/users/by/username/${usuario}`, { headers });
    const dataUser = await resUser.json();

    if (!dataUser.data || !dataUser.data.id) {
      console.error("⚠️ Usuario no encontrado:", dataUser);
      return { error: 'Usuario no encontrado' };
    }

    const userId = dataUser.data.id;

    const tweetURL = `https://api.twitter.com/2/users/${userId}/tweets?max_results=${limite}&tweet.fields=created_at,text`;
    const resTweets = await fetch(tweetURL, { headers });
    const dataTweets = await resTweets.json();

    if (dataTweets.errors) {
      console.error("❌ Error desde Twitter API:", dataTweets.errors);
      return { error: 'No se pudieron obtener los tweets' };
    }

    const mapper = (dataTweets.data || []).map(entry => {
      return {
        id: entry.id,
        text: entry.text,
        created_at: entry.created_at
      };
    });

    return mapper;
  } catch (err) {
    console.error("🚨 ERROR DE TWITTER:", err);
    return { error: 'Error al conectar con Twitter' };
  }
}

module.exports = { obtenerTweets };
