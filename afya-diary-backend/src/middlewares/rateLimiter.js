const store = new Map(); // phone -> { count, firstTs }

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 5; // allow 5 OTP requests per phone per hour

module.exports = function rateLimiter(req, res, next) {
  try {
    const phone = req.body.phone || (req.query && req.query.phone);
    if (!phone) return res.status(400).json({ message: 'phone required for rate limiter' });

    const now = Date.now();
    const entry = store.get(phone);
    if (!entry) {
      store.set(phone, { count: 1, firstTs: now });
      return next();
    }

    if (now - entry.firstTs > WINDOW_MS) {
      store.set(phone, { count: 1, firstTs: now });
      return next();
    }

    if (entry.count >= MAX_PER_WINDOW) {
      return res.status(429).json({ message: 'Too many requests, try later' });
    }

    entry.count += 1;
    store.set(phone, entry);
    return next();
  } catch (err) {
    console.error('rateLimiter error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
