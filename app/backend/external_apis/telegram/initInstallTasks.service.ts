import axios from "axios";

export const pushNoticeInstallTelegram = async (shopInstall : any) => {
  const telegramBotToken = "bot7191427268:AAFAPjsD7YQSvUzFZyU60cPXnT6g30t-bGU";
  const telegramChatId = "-4149726355";

  let data = JSON.stringify({
    chat_id: telegramChatId,
    text: `${shopInstall?.myshopify_domain} stores in ${shopInstall?.country_name} with email address ${shopInstall?.email} had just installed the Zotek Facebook Pixel.`,
  });
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.telegram.org/${telegramBotToken}/sendMessage`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios.request(config);

  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
};

export const pushNoticeTelegramUninstall = async (shop: string, body: string) => {
  const telegramBotToken = "bot7191427268:AAFAPjsD7YQSvUzFZyU60cPXnT6g30t-bGU";
  const telegramChatId = "-4149726355";
  let data = JSON.stringify({
    chat_id: telegramChatId,
    text: body || "",
  });
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.telegram.org/${telegramBotToken}/sendMessage`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
};

export const pushNoticeTelegramLCP = async (content:string) => {
  const telegramBotToken = "bot7191427268:AAFAPjsD7YQSvUzFZyU60cPXnT6g30t-bGU";
  const telegramChatId = "-4149726355";
  let data = JSON.stringify({
    chat_id: telegramChatId,
    text: content,
  });
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.telegram.org/${telegramBotToken}/sendMessage`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
};
