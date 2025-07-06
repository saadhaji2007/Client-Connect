import { useRouter } from "next/router";

export default function ClientCard({ client, onDelete, onEdit }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/clients/${client.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="p-4 bg-white rounded-xl shadow relative cursor-pointer hover:bg-gray-50"
    >
      <h3 className="text-xl font-semibold text-blue-600">{client.name}</h3>
      <p className="text-gray-500 mb-1">{client.company}</p>
      <p className="text-sm text-gray-700">{client.email}</p>
      <p className="text-sm text-gray-700">{client.phone}</p>
      <p className="text-xs mt-2 text-gray-400">Status: {client.status}</p>

      {/* ✏️ Edit Button */}
      <button
        className="absolute top-2 right-10 text-blue-600 hover:text-blue-800"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(client);
        }}
      >
        ✏️
      </button>

      {/* 🗑️ Delete Button */}
      <button
        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(client.id);
        }}
      >
        🗑️
      </button>
    </div>
  );
}
