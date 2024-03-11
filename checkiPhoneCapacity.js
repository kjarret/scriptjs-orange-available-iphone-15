const { chromium } = require("playwright");

async function checkCapacity(url, productName) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url);

    await page.waitForSelector('input[type="checkbox"][id^="capacity-"]');

    // Récupère toutes les capacités disponibles
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
  } catch (error) {
    console.error(`Une erreur s'est produite pour ${productName} :`, error);
  } finally {
    await browser.close();
  }
}

// Fonction pour exécuter le script pour chaque produit
const execute = () => {
  checkCapacity(
    "https://boutique.orange.fr/mobile/details/apple-iphone-15-pro-titane-bleu-1to?intention=acquisition",
    "Apple iPhone 15 Pro Titane bleu"
  );
  checkCapacity(
    "https://boutique.orange.fr/mobile/details/apple-iphone-15-pro-titane-noir-128go?intention=acquisition",
    "Apple iPhone 15 Pro Titane noir"
  );
};

execute();
setInterval(execute, 5 * 60 * 1000);
