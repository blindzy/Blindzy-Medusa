import { Router } from "express";
import axios from "axios";

const router = Router();

router.post("/store/customers/checkout/ship", async (req, res) => {
  try {
    const {
      reference,
      shipper,
      consignee,
      description,
      weight
    } = req.body;

    const payload = {
      Shipments: [
        {
          Reference1: reference || "Order-001",
          Shipper: {
            Reference1: "Blindzy",
            Name: shipper?.name || "Blindzy",
            PhoneNumber1: shipper?.phone || "0298765432",
            CellPhone: shipper?.mobile || "0412345678",
            Email: shipper?.email || "support@blindzy.com",
            Line1: shipper?.address || "1 Warehouse Road",
            City: shipper?.city || "Sydney",
            CountryCode: shipper?.country || "AU"
          },
          Consignee: {
            Reference1: "Customer",
            Name: consignee?.name,
            PhoneNumber1: consignee?.phone,
            CellPhone: consignee?.mobile,
            Email: consignee?.email,
            Line1: consignee?.address,
            City: consignee?.city,
            CountryCode: consignee?.country
          },
          Details: {
            Dimensions: {
              Length: 10,
              Width: 10,
              Height: 10,
              Unit: "cm"
            },
            ActualWeight: {
              Value: weight || 1,
              Unit: "KG"
            },
            ProductGroup: "DOM",
            ProductType: "OND",
            PaymentType: "P",
            PaymentOptions: "",
            Services: "",
            NumberOfPieces: 1,
            DescriptionOfGoods: description || "Window blinds",
            GoodsOriginCountry: process.env.ARAMEX_COUNTRY
          }
        }
      ],
      ClientInfo: {
        AccountCountryCode: process.env.ARAMEX_COUNTRY,
        AccountEntity: process.env.ARAMEX_ENTITY,
        AccountNumber: process.env.ARAMEX_ACCOUNT,
        AccountPin: process.env.ARAMEX_PIN,
        UserName: process.env.ARAMEX_USERNAME,
        Password: process.env.ARAMEX_PASSWORD,
        Version: "v1.0"
      },
      LabelInfo: {
        ReportID: 9201,
        ReportType: "URL"
      }
    };

    const response = await axios.post(
      "https://ws.aramex.net/shippingapi.v2/shipping/service_1_0.svc/CreateShipments",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const rate = response.data;
    if (rate?.Shipments && rate?.Shipments[0]?.ID) {
      res.status(200).json({
        awb: rate.Shipments[0].ID,
        label_url: rate.Shipments[0].ShipmentLabel?.LabelURL || "Not returned"
      });
    } else {
      res.status(400).json({
        message: "Shipment creation failed",
        errors: rate?.Notifications || rate
      });
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to create shipment",
      details: err.response?.data || err.message
    });
  }
});

export default router;
