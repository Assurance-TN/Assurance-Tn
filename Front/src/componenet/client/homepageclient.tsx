import React from 'react'
import Navbar from './navbar'
import Sidebar from './Sidebar'

interface HomepageclientProps {
  children?: React.ReactNode;
}

export default function Homepageclient({ children }: HomepageclientProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {children || (
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-semibold text-[#0e04c3]">Tableau de bord</h1>
              {/* Add your dashboard content here */}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
