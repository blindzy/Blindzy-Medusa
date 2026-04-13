//api/store/customers/checkout/calculate-shipping/route.ts

import { Request, Response } from "express"
import axios from 'axios'

export const POST = async (req: Request, res: Response) => {
  try {
    // Sample sandbox credentials and dummy addresses
    const payload = {
      ClientInfo: {
        AccountCountryCode: "AU",
        AccountEntity: "SYD",
        AccountNumber: "20016",  // Sample
        AccountPin: "331421",    // Sample
        UserName: "testingapi@aramex.com",  // Sample
        Password: "R123456789@1",          // Sample
        Version: "v1.0"
      },
      OriginAddress: {
        Line1: "10 Test Street",
        Line2: "",
        Line3: "",
        City: "Sydney",
        PostCode: "2000",
        CountryCode: "AU"
      },
      DestinationAddress: {
        Line1: "200 Main Road",
        Line2: "",
        Line3: "",
        City: "Melbourne",
        PostCode: "3000",
        CountryCode: "AU"
      },
      ShipmentDetails: {
        PaymentType: "P",
        ProductGroup: "DOM",
        ProductType: "OND",
        ActualWeight: {
          Unit: "KG",
          Value: 1
        },
        ChargeableWeight: {
          Unit: "KG",
          Value: 1
        },
        NumberOfPieces: 1,
        Dimensions: {
          Length: 10,
          Width: 10,
          Height: 10,
          Unit: "CM"
        },
        DescriptionOfGoods: "General Goods",
        GoodsOriginCountry: "AU",
        PaymentOptions: "P"
      }
    }

    const response = await axios.post(
      'https://ws.aramex.net/shippingapi.v2/RateCalculator/Service_1_0.svc/json/CalculateRate',
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return res.status(200).json({ rate: response.data })
  } catch (error: any) {
    console.error('Shipping rate error:', error.response?.data || error.message)
    return res.status(500).json({ error: 'Failed to calculate shipping rate' })
  }
}
