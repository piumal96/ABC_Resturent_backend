const session = require('supertest-session');
const app = require('../testServer'); // Import the test server
const { ensureAuthenticated, ensureAdmin, ensureStaffOrAdmin } = require('../middlewares/roleMiddleware'); // Correct path if in the same folder


describe('Middleware Tests', () => {
  let testSession;

  beforeEach(() => {
    testSession = session(app); // Ensure this is correctly initializing
  });

  // Test ensureAuthenticated middleware
  describe('GET /authenticated', () => {
    it('should return 401 if not authenticated', async () => {
      const res = await testSession.get('/authenticated');
      console.log('Response when not authenticated:', res.body);  // Log response for debugging
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('msg', 'Unauthorized, please log in.');
    });

    it('should allow access if authenticated', async () => {
      // Mock login
      await testSession.post('/login').send({ user: { role: 'Customer' } });

      const res = await testSession.get('/authenticated');
      console.log('Response when authenticated:', res.body);  // Log response for debugging
      expect(res.statusCode).toBe(200);  // Check the response here
      expect(res.body).toHaveProperty('msg', 'Authenticated');
    });
  });

  // Test ensureAdmin middleware
  describe('GET /admin', () => {
    it('should return 403 if not an admin', async () => {
      // Mock login as a non-admin user
      await testSession.post('/login').send({ user: { role: 'Customer' } });

      const res = await testSession.get('/admin');
      console.log('Response when not admin:', res.body);  // Log response for debugging
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('msg', 'Forbidden, Admins only.');
    });

    it('should allow access if user is an admin', async () => {
      // Mock login as an admin
      await testSession.post('/login').send({ user: { role: 'Admin' } });

      const res = await testSession.get('/admin');
      console.log('Response when admin:', res.body);  // Log response for debugging
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Admin Access');
    });
  });

  // Test ensureStaffOrAdmin middleware
  describe('GET /staff-or-admin', () => {
    it('should return 403 if not staff or admin', async () => {
      // Mock login as a non-staff, non-admin user
      await testSession.post('/login').send({ user: { role: 'Customer' } });

      const res = await testSession.get('/staff-or-admin');
      console.log('Response when not staff/admin:', res.body);  // Log response for debugging
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('msg', 'Forbidden, Staff or Admins only.');
    });

    it('should allow access if user is staff', async () => {
      // Mock login as a staff member
      await testSession.post('/login').send({ user: { role: 'Staff' } });

      const res = await testSession.get('/staff-or-admin');
      console.log('Response when staff:', res.body);  // Log response for debugging
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Staff or Admin Access');
    });

    it('should allow access if user is admin', async () => {
      // Mock login as an admin
      await testSession.post('/login').send({ user: { role: 'Admin' } });

      const res = await testSession.get('/staff-or-admin');
      console.log('Response when admin:', res.body);  // Log response for debugging
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Staff or Admin Access');
    });
  });
});
