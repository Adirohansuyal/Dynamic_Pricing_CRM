import { Product } from "@shared/schema";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PriceHistoryChartProps {
  products: Product[];
}

export default function PriceHistoryChart({ products }: PriceHistoryChartProps) {
  // For demo purposes, generate some historical data
  const generateHistoricalData = (products: Product[]) => {
    const data = [];
    const now = new Date();
    
    // Generate data points for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dataPoint: any = {
        date: date.toLocaleDateString(),
      };
      
      products.forEach((product) => {
        // Add some random variation to create realistic-looking data
        const basePrice = Number(product.currentPrice);
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        dataPoint[`${product.name}_price`] = Number((basePrice * (1 + variation)).toFixed(2));
        
        if (product.competitorPrice) {
          const compVariation = (Math.random() - 0.5) * 0.1;
          dataPoint[`${product.name}_competitor`] = Number((Number(product.competitorPrice) * (1 + compVariation)).toFixed(2));
        }
      });
      
      data.push(dataPoint);
    }
    
    return data;
  };

  const data = generateHistoricalData(products);

  return (
    <Card className="border-none bg-black/40 backdrop-blur-xl shadow-2xl shadow-primary/10 mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Price History
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-10" />
              <XAxis 
                dataKey="date" 
                stroke="currentColor" 
                className="text-muted-foreground text-xs"
              />
              <YAxis 
                stroke="currentColor" 
                className="text-muted-foreground text-xs"
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              {products.map((product, index) => (
                <Line
                  key={`${product.name}_price`}
                  type="monotone"
                  dataKey={`${product.name}_price`}
                  name={`${product.name} (Our Price)`}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              ))}
              {products.map((product, index) => (
                product.competitorPrice && (
                  <Line
                    key={`${product.name}_competitor`}
                    type="monotone"
                    dataKey={`${product.name}_competitor`}
                    name={`${product.name} (Competitor)`}
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    dot={false}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
