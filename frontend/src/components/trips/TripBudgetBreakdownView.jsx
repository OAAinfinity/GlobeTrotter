import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Input } from '../common/Input';
import {
  PieChart as PieIcon,
  BarChart3,
  DollarSign,
  AlertTriangle,
  Sparkles,
  Layers,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

const CATEGORY_COLORS = {
  Stay: '#F59E0B', // Amber
  Activities: '#0D9488', // Teal
  Transport: '#3B82F6', // Blue
  Meals: '#8B5CF6' // Purple
};

export const TripBudgetBreakdownView = ({
  trip,
  cities = [],
  activities = []
}) => {
  const [dailyBudgetThreshold, setDailyBudgetThreshold] = useState(250);

  if (!trip) return null;

  const tripStops = trip.cities || [];

  // Calculate total days
  const calculateTotalDays = () => {
    if (!trip.startDate || !trip.endDate) return 7;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 7;
  };

  const totalDays = calculateTotalDays();

  // Calculate category totals
  const lodgingTotal = tripStops.reduce((sum, leg) => {
    const city = cities.find((c) => c.id === leg.cityId || c.name === leg.cityName);
    const rate = city ? city.avgDailyCost : 200;
    return sum + rate * (leg.days || 3);
  }, 0);

  const selectedActivityObjs = activities.filter((a) =>
    (trip.selectedActivities || []).includes(a.id)
  );

  const activitiesTotal = selectedActivityObjs.reduce(
    (sum, a) => sum + (a.cost || 0),
    0
  );

  const transportTotal = Object.values(trip.transportFares || {}).reduce(
    (sum, fare) => sum + (fare || 0),
    0
  );

  // Estimate meals as 20% of lodging + activities
  const mealsTotal = Math.round((lodgingTotal + activitiesTotal) * 0.2);

  const totalTripCost = lodgingTotal + activitiesTotal + transportTotal + mealsTotal;
  const avgCostPerDay = Math.round(totalTripCost / (totalDays || 1));
  const targetBudget = trip.totalBudget || 4500;

  // Pie chart category dataset
  const categoryPieData = [
    { name: 'Stay', value: lodgingTotal },
    { name: 'Activities', value: activitiesTotal },
    { name: 'Transport', value: transportTotal },
    { name: 'Meals', value: mealsTotal }
  ].filter((item) => item.value > 0);

  // Day-by-Day cost bar chart dataset
  const dayBarData = Array.from({ length: totalDays }, (_, i) => {
    const dayNum = i + 1;
    // Distribute stay daily cost + activities assigned
    const dayLodging = Math.round(lodgingTotal / totalDays);
    const dayMeals = Math.round(mealsTotal / totalDays);
    const dayActivities = Math.round(activitiesTotal / totalDays);
    const dayTotal = dayLodging + dayMeals + dayActivities;

    return {
      dayLabel: `Day ${dayNum}`,
      cost: dayTotal,
      exceeds: dayTotal > dailyBudgetThreshold
    };
  });

  // Identify threshold exceedance alert days
  const exceededDays = dayBarData.filter((d) => d.exceeds);

  return (
    <div className="flex flex-col gap-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 border-brand-200 bg-gradient-to-br from-brand-50/50 to-white shadow-warm-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Total Estimated Cost</span>
            <DollarSign className="w-4 h-4 text-brand-600" />
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              ${totalTripCost.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Target Budget: ${targetBudget.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card className="p-6 border-ocean-200 bg-gradient-to-br from-ocean-50/50 to-white shadow-warm-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Average Cost / Day</span>
            <BarChart3 className="w-4 h-4 text-ocean-600" />
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              ${avgCostPerDay.toLocaleString()}
              <span className="text-xs font-normal text-slate-400">/day</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Spanning {totalDays} scheduled travel days
            </p>
          </div>
        </Card>

        <Card className="p-6 border-slate-200/80 shadow-warm-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Daily Budget Limit</span>
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
          </div>

          <div className="mt-2">
            <Input
              type="number"
              value={dailyBudgetThreshold}
              onChange={(e) => setDailyBudgetThreshold(Number(e.target.value))}
              helperText="Configurable threshold alert limit"
            />
          </div>
        </Card>
      </div>

      {/* Threshold Alert Banners */}
      {exceededDays.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-3 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold block">
              Daily Limit Warning (${dailyBudgetThreshold}/day threshold):
            </span>
            <span>
              {exceededDays.length} {exceededDays.length === 1 ? 'day' : 'days'} ({exceededDays.map((d) => d.dayLabel).join(', ')}) exceed your daily threshold. Consider reallocating activities.
            </span>
          </div>
        </div>
      )}

      {/* Recharts Pie & Bar Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart: Cost Breakdown by Category */}
        <Card className="p-6 flex flex-col gap-4 border-slate-200/80 shadow-warm-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-brand-500" /> Cost Breakdown by Category
            </h3>
            <Badge variant="amber">Category Distribution</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[entry.name] || '#64748B'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Cost']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bar Chart: Day-by-Day Cost */}
        <Card className="p-6 flex flex-col gap-4 border-slate-200/80 shadow-warm-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-ocean-600" /> Day-by-Day Cost Breakdown
            </h3>
            <Badge variant="ocean">Daily Spend</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayBarData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="dayLabel" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [`$${val}`, 'Daily Cost']} />
                <ReferenceLine
                  y={dailyBudgetThreshold}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  label={{ value: 'Threshold Limit', fill: '#EF4444', fontSize: 10 }}
                />
                <Bar dataKey="cost" fill="#0D9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
