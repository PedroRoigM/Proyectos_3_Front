import React from 'react';

const UserSearchInput = ({ searchTerm, setSearchTerm, placeholder }) => {
    return (
        <div className="relative mb-6">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder || "Buscar por email..."}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
                <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default UserSearchInput;