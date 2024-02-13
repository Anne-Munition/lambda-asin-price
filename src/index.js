const amazonPaapi = require('amazon-paapi');

const commonParameters = {
  AccessKey: process.env.ACCESS_KEY,
  SecretKey: process.env.SECRET_KEY,
  PartnerTag: process.env.PARTNER_TAG,
  PartnerType: 'Associates',
  Marketplace: 'www.amazon.com',
};

const headers = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
};

async function handler(event) {
  const results = await getItems(JSON.parse(event.body));

  return {
    statusCode: 200,
    headers,
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
        let price;
        try {
          price = item.Offers.Listings[0].Price.DisplayAmount;
        } catch (e) {
          price = null;
        }
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
