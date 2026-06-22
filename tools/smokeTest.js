const API_URL = process.env.API_URL || 'http://localhost:5000/api';

const users = [
  { email: 'admin@logistics.com', password: 'password123', role: 'admin' },
  { email: 'dispatcher@logistics.com', password: 'password123', role: 'dispatcher' },
  { email: 'driver1@logistics.com', password: 'password123', role: 'driver' },
  { email: 'warehouse@logistics.com', password: 'password123', role: 'warehouse' },
  { email: 'gate@logistics.com', password: 'password123', role: 'gate' },
];

const json = (r) => r.json().catch(() => ({}));

async function request(method, path, token, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API_URL + path, opts);
  const data = await json(res);
  return { status: res.status, data };
}

const actions = async (token) => {
  const results = {};
  try {
    const r = await request('GET', '/shipments', token);
    results.shipments = { status: r.status, count: Array.isArray(r.data) ? r.data.length : undefined };
  } catch (e) { results.shipments = { error: e.message }; }

  try {
    const r = await request('GET', '/delivery/tasks', token);
    results.deliveryTasks = { status: r.status, count: Array.isArray(r.data) ? r.data.length : undefined };
  } catch (e) { results.deliveryTasks = { error: e.message }; }

  try {
    const r = await request('POST', '/delivery/bot/run', token);
    results.runBot = { status: r.status, data: r.data };
  } catch (e) { results.runBot = { error: e.message }; }

  try {
    const r = await request('POST', '/messages/broadcast', token, { text: 'Smoke test broadcast' });
    results.broadcast = { status: r.status, data: r.data };
  } catch (e) { results.broadcast = { error: e.message }; }

  try {
    const r = await request('GET', '/gate/logs', token);
    results.gateLogs = { status: r.status, count: Array.isArray(r.data) ? r.data.length : undefined };
  } catch (e) { results.gateLogs = { error: e.message }; }

  try {
    const list = await request('GET', '/shipments', token);
    const id = Array.isArray(list.data) && list.data[0]?._id;
    if (id) {
      const upd = await request('PATCH', `/shipments/${id}/status`, token, { status: 'in_transit', note: 'Smoke test update' });
      results.tryUpdate = { status: upd.status, data: upd.data };
    } else {
      results.tryUpdate = { error: 'no-shipment' };
    }
  } catch (e) { results.tryUpdate = { error: e.message }; }

  return results;
};

const run = async () => {
  console.log('Smoke tests against', API_URL);
  for (const u of users) {
    try {
      const login = await request('POST', '/auth/login', null, { email: u.email, password: u.password });
      if (login.status !== 200) {
        console.error('Login failed for', u.email, login);
        continue;
      }
      const token = login.data.token;
      console.log('\n---', u.email, u.role);
      const res = await actions(token);
      console.dir(res, { depth: 3 });
    } catch (err) {
      console.error('Error for', u.email, err.message);
    }
  }
};

run().catch((e) => { console.error(e); process.exit(1); });
