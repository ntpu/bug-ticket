const puppeteer = require('puppeteer');

const xRay = async (startDate, endDate) => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  const hostname = 'https://www.expedia.com/Flights-Search';
  const cabinClass = 'business';
  const pageUrl =
    hostname + '?flight-type=on&starDate=' + startDate + '&endDate=' + endDate + '&mode=search&trip=roundtrip&' +
    'leg1=from:Los+Angeles,+CA+(LAX-Los+Angeles+Intl.),to:Taipei,+Taiwan+(TPE-All+Airports),departure:' + startDate +
    'TANYT&leg2=from:Taipei,+Taiwan+(TPE-All+Airports),to:Los+Angeles,+CA+(LAX-Los+Angeles+Intl.),departure:' +
    endDate + 'TANYT&passengers=children:0,adults:1,seniors:0,infantinlap:Y&options=cabinclass:' + cabinClass + ',';

  // console.log('go to: ' + pageUrl);
  await page.goto(pageUrl);

  const flightList = await page.evaluate(() => {
    const list = Array.from(document.getElementById('flightModuleList').querySelectorAll('li.offer-listing'));
    return list.map(item => {
      const airline = item.querySelector("span[data-test-id='airline-name']");
      const price = item.querySelector("span[data-test-id='listing-price-dollars']");
      return {
        airline: airline ? airline.innerText.trim() : null,
        price: price ? price.innerText.trim() : null
      };
    });
  });

  const processedFlightList = Array.from(flightList).filter(f => f.price).map(
    f => Object.assign({}, f, {
      price: parseFloat(f.price.replace(/[^0-9.-]+/g, ''))
    })
  );
  console.log(JSON.stringify(processedFlightList));

  await browser.close();
};

module.exports = { xRay };