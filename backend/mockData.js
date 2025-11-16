const { v4: uuidv4 } = require('uuid');

const sampleTableResponse = (question) => {
  return {
    description: `Mock response for: "${question}". This contains a structured (tabular) dataset and a short explanation.`,
    table: {
      columns: ["Name", "Metric A", "Metric B", "Status"],
      rows: [
        ["Item 1", 123, 45.6, "OK"],
        ["Item 2", 98, 12.0, "Warning"],
        ["Item 3", 432, 78.9, "OK"]
      ]
    }
  };
};

const sessions = {};

const seedSession = () => {
  const id = uuidv4();
  sessions[id] = {
    id,
    title: `Demo session ${Object.keys(sessions).length + 1}`,
    createdAt: new Date().toISOString(),
    messages: [
      { role: "user", text: "Show me the three items", timestamp: new Date().toISOString() },
      {
        role: "assistant",
        text: "Here is a sample table",
        response: sampleTableResponse("Show me the three items"),
        feedback: null,
        timestamp: new Date().toISOString()
      }
    ]
  };
  return id;
};

if (Object.keys(sessions).length === 0) {
  seedSession();
}

module.exports = {
  sessions,
  sampleTableResponse,
  seedSession
};
