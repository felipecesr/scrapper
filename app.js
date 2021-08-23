const fetch = require("node-fetch");
const cheerio = require("cheerio");
const crawler = require("crawler-request");
const sgMail = require("@sendgrid/mail");

console.log(process.env.SENDGRID_API_KEY);

async function sayHello() {
  async function getDownloadLinkByUrl(url) {
    const html = await fetch(url).then((res) => res.text());
    const $ = cheerio.load(html);
    let name = $(".download").attr("onclick");
    name = name.match(/location\.href\s*=\s*['"]([^'"]*)['"]/);
    let link = url + name[1];
    return link;
  }

  const url = "https://books.goalkicker.com/DotNETFrameworkBook/";
  const fileLink = await getDownloadLinkByUrl(url);
  const fileText = await crawler(fileLink).then((res) => res.text);

  if (!!fileText.match(/akshay anand/i)) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: "felipecesr@gmail.com",
      from: "jeanfelipecc@gmail.com",
      subject: "Baixe seu novo arquivo",
      text: fileLink,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("mail sent successfully...");
      })
      .catch((err) => {
        console.log(err?.response?.body?.errors);
      });
  } else {
    console.log("palavras chave nao encontradas");
  }
}
sayHello();
