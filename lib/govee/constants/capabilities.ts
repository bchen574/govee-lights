export const DEVICE_CAPABILITIES = {
  H619A: {
    powerSwitch: {
      type: "devices.capabilities.on_off",
      instance: "powerSwitch",
    },
    brightness: {
      type: "devices.capabilities.range",
      instance: "brightness",
    },
  },

  H6008: {
    powerSwitch: {
      type: "devices.capabilities.on_off",
      instance: "powerSwitch",
    },
    brightness: {
      type: "devices.capabilities.range",
      instance: "brightness",
    },
  },
} as const;

export type DeviceSKU = keyof typeof DEVICE_CAPABILITIES;
export type DeviceCapability = keyof (typeof DEVICE_CAPABILITIES)[DeviceSKU];
