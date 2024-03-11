const { chromium } = require("playwright");
const nodemailer = require("nodemailer");
const readline = require("readline");
require("dotenv").config();

// Créer une interface de lecture
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Demander à l'utilisateur sur quel e-mail il veut envoyer les informations
rl.question("Veuillez entrer l'adresse e-mail de destination : ", (email) => {
  // Configurer le transporter SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SENDGRID_USERNAME,
      pass: process.env.SENDGRID_PASSWORD,
    },
  });

  let previousResults = {};

  async function checkCapacityAndSendEmail(url, productName) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto(url);

      await page.waitForSelector('input[type="checkbox"][id^="capacity-"]');

      const capacities = await page.evaluate(() => {
        const capacityElements = document.querySelectorAll(
          'input[type="checkbox"][id^="capacity-"]'
        );
        const capacities = [];

        capacityElements.forEach((element) => {
          const capacity = {
            title: element.nextElementSibling.textContent.trim(),
            disabled: element.disabled,
          };
          capacities.push(capacity);
        });

        return capacities;
      });

      console.log(`\nCapacités disponibles pour ${productName}:`);
      capacities.forEach((capacity) => {
        if (capacity.disabled) {
          console.log(`${capacity.title} : Indisponible`);
        } else {
          console.log(`${capacity.title} : Disponible`);
        }
      });

      const resultsKey = `${url}-${productName}`;
      const previousResult = previousResults[resultsKey];

      if (
        !previousResult ||
        JSON.stringify(previousResult) !== JSON.stringify(capacities)
      ) {
        const mailOptions = {
          from: "checkiphoneapi@mail.com",
          to: email, // Utilisation de l'e-mail entré par l'utilisateur
          subject: `Changement de disponibilité pour ${productName}`,
          text: `Les nouvelles disponibilités pour ${productName} sont :\n${JSON.stringify(
            capacities
          )}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Erreur lors de l'envoi de l'e-mail :", error);
          } else {
            console.log("E-mail envoyé avec succès :", info.response);
          }
        });

        previousResults[resultsKey] = capacities;
      }
    } catch (error) {
      console.error(`Une erreur s'est produite pour ${productName} :`, error);
    } finally {
      await browser.close();
    }
  }

  const execute = () => {
    checkCapacityAndSendEmail(
      "https://boutique.orange.fr/mobile/details/apple-iphone-15-pro-titane-bleu-1to?intention=acquisition",
      "Apple iPhone 15 Pro Titane bleu"
    );
    checkCapacityAndSendEmail(
      "https://boutique.orange.fr/mobile/details/apple-iphone-15-pro-titane-noir-128go?intention=acquisition",
      "Apple iPhone 15 Pro Titane noir"
    );
  };

  execute();
  setInterval(execute, 5 * 60 * 1000);

  // Fermer l'interface de lecture lorsque le programme se termine
  rl.close();
});
