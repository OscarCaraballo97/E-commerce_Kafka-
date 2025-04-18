const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventId: String,
  timestamp: Date,
  source: String,
  topic: String,
  payload: Object,
  snapshot: Object
});

const Event = mongoose.model('Event', eventSchema);

const logEvent = async ({ source, topic, payload, snapshot }) => {
  const event = new Event({
    eventId: uuidv4(),
    timestamp: new Date(),
    source,
    topic,
    payload,
    snapshot
  });
  await event.save();
};

module.exports = { logEvent };
