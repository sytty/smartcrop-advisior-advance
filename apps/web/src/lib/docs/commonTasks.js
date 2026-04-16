export const commonTasks = [
  {
    id: "get-recommendation",
    title: "Get Crop Recommendations",
    overview: "Find out what to plant next season.",
    steps: [
      "Navigate to 'AI Crop Advisor'.",
      "Verify your field location is correct.",
      "Click the 'Get Recommendation' button.",
      "Wait 3 seconds for the AI to analyze data.",
      "Click 'Why this crop?' to understand the reasoning."
    ],
    results: "A list of top 3 crops with expected yield and profit.",
    tips: "Always check the market price forecast before making a final decision."
  },
  {
    id: "plan-irrigation",
    title: "Plan Irrigation Schedule",
    overview: "Set up automatic watering for your fields.",
    steps: [
      "Go to 'Smart Irrigation'.",
      "Select a specific field zone.",
      "Check current soil moisture.",
      "Toggle 'Auto-Watering' to ON.",
      "Set your preferred watering time (e.g., 05:00 AM)."
    ],
    results: "Sprinklers will automatically run only when soil is dry and no rain is expected.",
    tips: "Group similar crops into the same watering zone to save pump energy."
  }
];