
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({ eventId: String, timestamp: String, source: String, topic: String, payload: Object, snapshot: Object });

module.exports = mongoose.model('Event', eventSchema);

