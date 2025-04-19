import React from 'react'
import Navbar from './navbar'
import Sidebar from './Sidebar'

export default function Homepageclient() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Main content will go here */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
            {/* Add your dashboard content here */}
          </div>
        </main>
      </div>
    </div>
  )
}
