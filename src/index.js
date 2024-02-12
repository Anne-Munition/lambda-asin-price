const amazonPaapi = require('amazon-paapi');

const commonParameters = {
  AccessKey: process.env.ACCESS_KEY,
  SecretKey: process.env.SECRET_KEY,
  PartnerTag: process.env.PARTNER_TAG,
  PartnerType: 'Associates',
  Marketplace: 'www.amazon.com',
};

async function handler(event) {
  const results = await getItems(JSON.parse(event.body));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results),
  };
}

function getItems(asins) {
  return new Promise((resolve) => {
    const requestParameters = {
      ItemIds: asins,
      ItemIdType: 'ASIN',
      Condition: 'New',
      Resources: [
        'Images.Primary.Medium',
        'ItemInfo.Title',
        'Offers.Listings.Price',
      ],
    };

    amazonPaapi.GetItems(commonParameters, requestParameters).then((data) => {
      const results = data.ItemsResult.Items.map((item) => {
        const asin = item.ASIN;
        const price = item.Offers.Listings[0].Price.DisplayAmount;
        return {
          asin,
          price,
        };
      });
      resolve(results);
    });
  });
}

module.exports = {
  handler,
};
