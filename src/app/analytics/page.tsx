
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChartIcon } from "lucide-react"; // Using PieChartIcon as PieChart is not available

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Analytics</h1>
      <div className="space-y-8 text-foreground">
        <p>Explore detailed analytics and gain insights from your data. This section provides various charts and reports to help you understand trends and performance.</p>
        
        <section>
          <h2 className="text-2xl font-semibold text-secondary-foreground mb-4">Data Visualization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Usage Trends</CardTitle>
                <LineChart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                 <div className="h-48 bg-muted mt-4 rounded-md flex items-center justify-center text-sm text-muted-foreground" data-ai-hint="line graph">Graph Placeholder</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Performance Metrics</CardTitle>
                <BarChart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">85%</div>
                <p className="text-xs text-muted-foreground">
                  Target achieved. Duis aute irure dolor in reprehenderit in voluptate velit.
                </p>
                <div className="h-48 bg-muted mt-4 rounded-md flex items-center justify-center text-sm text-muted-foreground" data-ai-hint="bar chart">Graph Placeholder</div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-secondary-foreground mb-4">Detailed Reports</h2>
           <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Category Breakdown</CardTitle>
                <PieChartIcon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                 Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Ut enim ad minim veniam, quis nostrud exercitation.
                </p>
                <div className="h-64 bg-muted mt-4 rounded-md flex items-center justify-center text-sm text-muted-foreground" data-ai-hint="pie chart">Graph Placeholder</div>
              </CardContent>
            </Card>
        </section>

        <p className="mt-6">Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
      </div>
    </div>
  );
}
