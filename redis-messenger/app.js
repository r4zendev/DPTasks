const Redis = require("ioredis");
const crypto = require("crypto");
const https = require("https");

const listErrors = (client) => {
  const stream = client.scanStream({
    match: "error:*",
    count: 100,
  });

  const keys = [];
  stream.on("data", (resultKeys) => {
    for (let i = 0; i < resultKeys.length; i++) {
      client.get(resultKeys[i], (err, res) => {
        console.log(`${resultKeys[i]} <------> ${res}`);
      });
      keys.push(resultKeys[i]);
    }
  });
  stream.on("end", function () {
    client.unlink(keys);
  });
};

const getClients = (client, callback) => {
  const clients = [];
  client.client("list", (err, clientList) => {
    clientList
      .split("\n")
      .slice(0, -1)
      .forEach((client) => {
        const clientsObj = {};
        client.split(" ").forEach((field) => {
          const [key, value] = field.split("=");
          clientsObj[key] = value;
        });
        clients.push(clientsObj);
      });
    callback(clients);
  });
};

const becomeMessenger = (client) => {
  console.log("msger");
  client.client("setname", "generator");
  let channelList;
  let currentChannel = -1;
  setInterval(() => {
    client.pubsub("channels", (err, list) => {
      console.log(list);
      channelList = list;
    });
    const loremURL = new URL("https://baconipsum.com/api/");
    loremURL.searchParams.append("type", "all-meat");
    loremURL.searchParams.append("sentences", "6");

    https.get(loremURL, (res) => {
      res.on("data", (data) => {
        const message = data
          .toString()
          .slice(2, Math.floor(Math.random() * 21) + 100);
        if (currentChannel >= channelList.length - 1) currentChannel = -1;
        client.publish(channelList[++currentChannel], message);
        client.publish("keepAliveChannel", "alive");
      });
    });
  }, 500);
};

const becomeListener = (client) => {
  console.log("listen");
  client.client("setname", "listener");
  let timerHolder, subChannel;
  subChannel = crypto
    .createHash("md5")
    .update(Math.random().toString())
    .digest("hex");
  client.subscribe(subChannel);
  client.subscribe("keepAliveChannel");
  const errorValidation = (msg) => {
    if (Math.random() < 0.05) {
      const hashValue = crypto.createHash("md5").update(msg).digest("hex");
      client.unsubscribe(() => {
        client.set(`error:${hashValue}`, msg, Redis.print);
        client.subscribe(subChannel);
        client.subscribe("keepAliveChannel");
        return `error:${hashValue}`;
      });
    }
    return false;
  };
  client.on("message", (channel, msg) => {
    if (channel === "keepAliveChannel") {
      clearTimeout(timerHolder);
      timerHolder = setTimeout(() => {
        client.unsubscribe(() => {
          client.client("pause", 1000, (err, res) => {
            console.log(res);
            getClients(client, (cliList) => {
              const connNames = cliList.map(({ name }) => name);
              if (connNames.indexOf("generator") < 0) {
                console.log("generating now");
                becomeMessenger(client);
              } else {
                client.subscribe(subChannel);
                client.subscribe("keepAliveChannel");
              }
            });
          });
        });
      }, 1000);
    } else {
      const errorKey = errorValidation(msg);
      if (errorKey) {
        console.log(
          "Received error on channel " +
            channel +
            ". Error object key: " +
            errorKey
        );
      } else {
        console.log("Received message " + msg + " on channel " + channel);
      }
    }
  });
};

const launch = (getErrors = false) => {
  let client = new Redis();
  if (getErrors) {
    listErrors(client);
  } else {
    client.client("list", (err, result) => {
      if (err) throw new Error(err);
      if (result.split("\n").slice(0, -1).length > 1) {
        becomeListener(client);
      } else {
        becomeMessenger(client);
      }
    });
  }
};

launch();
