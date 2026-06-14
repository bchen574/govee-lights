export type Device = keyof typeof ALL_DEVICES;

export const ALL_DEVICES = {
  tv: {
    deviceName: "TV",
    sku: "H619A",
    device: "14:70:D1:05:C3:46:2A:69",
  },

  bedroom: {
    deviceName: "Bedroom",
    sku: "H619A",
    device: "17:01:D4:0E:86:06:7E:3F",
  },

  ceiling: {
    deviceName: "Ceiling",
    sku: "H6008",
    device: "05:E7:5C:E7:53:6A:D8:DC",
  },

  mirror: {
    deviceName: "Mirror",
    sku: "H6008",
    device: "05:4A:5C:E7:53:66:42:66",
  },

  ball: {
    deviceName: "Ball",
    sku: "H6008",
    device: "05:19:5C:E7:53:65:C0:A4",
  },

  lamp: {
    deviceName: "Low Lamp",
    sku: "H6008",
    device: "05:14:5C:E7:53:6A:BE:7C",
  },
} as const;
