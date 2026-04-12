async function main() {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' }),
  });
  const login = await loginRes.json();
  console.log('TOKEN:', login.token);

  const statsRes = await fetch('http://localhost:5000/api/bookings/admin/stats', {
    headers: { Authorization: 'Bearer ' + login.token },
  });
  console.log('STATUS:', statsRes.status);
  const stats = await statsRes.json();
  console.log(JSON.stringify(stats, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });