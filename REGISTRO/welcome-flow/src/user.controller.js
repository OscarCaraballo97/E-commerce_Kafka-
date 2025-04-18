const User = require('./user.model');
const { sendKafkaMessage } = require('./kafka');
const { logEvent } = require('./eventLogger');

const registerUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    // Evento 1: Registro de usuario
    const payload = {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone
    };

    const snapshot = {
      userId: user._id,
      status: 'REGISTERED'
    };

    await logEvent({
      source: 'UserService',
      topic: 'user-registration',
      payload,
      snapshot
    });

    await sendKafkaMessage('welcome-flow', {
      to: user.email,
      subject: '¡Bienvenido a nuestra plataforma!',
      content: `Hola ${user.name}, gracias por registrarte en nuestro e-commerce.`
    });

    res.status(201).json({ message: 'Usuario registrado', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

module.exports = { registerUser };
