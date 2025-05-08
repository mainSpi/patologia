
export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Dashboard</h1>
      <div className="space-y-4 text-foreground">
        <p>Welcome to your dashboard. Here you can find an overview of your activities and key metrics.</p>
        
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-secondary-foreground mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-card-foreground mb-2">Active Projects</h3>
              <p className="text-3xl font-bold text-primary">5</p>
              <p className="text-sm text-muted-foreground mt-1">Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-card-foreground mb-2">Tasks Completed</h3>
              <p className="text-3xl font-bold text-primary">128</p>
              <p className="text-sm text-muted-foreground mt-1">Consectetur adipiscing elit.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-card-foreground mb-2">Upcoming Deadlines</h3>
              <p className="text-3xl font-bold text-primary">3</p>
              <p className="text-sm text-muted-foreground mt-1">Sed do eiusmod tempor.</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-secondary-foreground mb-4">Recent Activity</h2>
          <div className="bg-card p-6 rounded-lg shadow">
            <ul className="space-y-3">
              <li className="text-sm text-muted-foreground">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</li>
              <li className="text-sm text-muted-foreground">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.</li>
              <li className="text-sm text-muted-foreground">Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</li>
            </ul>
          </div>
        </section>
        
        <p className="mt-6">Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula.</p>
      </div>
    </div>
  );
}
