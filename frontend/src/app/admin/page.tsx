'use client';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <p className="text-gray-600 mb-4">Manage your product inventory</p>
          <a href="/admin/products" className="text-primary hover:text-primary/80">
            View Products →
          </a>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Orders</h2>
          <p className="text-gray-600 mb-4">View and manage customer orders</p>
          <a href="/admin/orders" className="text-primary hover:text-primary/80">
            View Orders →
          </a>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <p className="text-gray-600 mb-4">Manage user accounts</p>
          <a href="/admin/users" className="text-primary hover:text-primary/80">
            View Users →
          </a>
        </div>
      </div>
    </div>
  );
}
