export default function topbar() {
    <div className="flex justify-end mb-4">
  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow">
    + Add Client
  </button>
</div>
  return (
    <div className="bg-white rounded-xl p-4 mb-4 shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Welcome, Saad 👋</h2>
        <button className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600">
          Logout
        </button>
      </div>
    </div>
  );
}
