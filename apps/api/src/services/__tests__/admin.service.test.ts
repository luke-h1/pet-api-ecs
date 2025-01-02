import AdminService from '../admin.service';

describe('AdminService', () => {
  const adminService = new AdminService();

  test('flushes redis db', async () => {
    const result = await adminService.flush();
    expect(result).toBe('OK');
  });
});
