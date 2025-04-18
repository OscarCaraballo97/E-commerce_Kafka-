const EventEmitter = require('events');
const eventBus = new EventEmitter();

function emitEvent(topic, data) {
    eventBus.emit(topic, data);
}

function subscribe(topic, handler) {
    eventBus.on(topic, handler);
}

module.exports = { emitEvent, subscribe };