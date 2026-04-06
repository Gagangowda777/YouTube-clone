function MainContent({ isSidebarOpen }) {
  return (
    <main className={`flex-1 pt-6 px-6 ${isSidebarOpen ? 'ml-60' : 'ml-20'}`}>
      {/* Main content area */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Main Content</h1>
      </div>
    </main>
  );
}

export default MainContent;