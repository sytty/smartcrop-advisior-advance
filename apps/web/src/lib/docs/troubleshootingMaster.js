export const troubleshootingMaster = [
  {
    category: "Data Issues",
    problems: [
      {
        title: "Sensors not updating",
        symptoms: "Dashboard shows old data, or 'Offline' badge appears.",
        solutions: [
          "Check the battery level of the physical sensor in the field.",
          "Ensure the gateway hub has power and internet connection.",
          "Click the 'Refresh' button on the IoT dashboard."
        ],
        whenToContact: "If the sensor has fresh batteries and the hub is online, but data hasn't updated in 24 hours."
      }
    ]
  },
  {
    category: "Performance Issues",
    problems: [
      {
        title: "Map loading slowly",
        symptoms: "Satellite imagery takes more than 5 seconds to appear.",
        solutions: [
          "Check your internet connection speed.",
          "Clear your browser cache.",
          "Switch to 'Low Resolution' mode in Settings > Preferences."
        ],
        whenToContact: "If the map fails to load completely and shows a gray box."
      }
    ]
  }
];