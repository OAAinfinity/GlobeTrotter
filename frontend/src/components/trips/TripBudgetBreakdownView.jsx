import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Input } from '../common/Input';
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
import {
  DollarSign,
  PieChart as PieIcon,
  BarChart3,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Info
} from 'lucide-react';

const CATEGORY_COLORS = {
  Stay: '#0D9488', // Teal
  Activities: '#F59E0B', // Amber
  Transport: '#6366F1', // Indigo
  Meals: '#10B981' // Emerald
};

export const TripBudgetBreakdownView = ({ trip, cities = [], activities = [] }) => {
  if (!trip) return null;

  const [dailyThreshold, setDailyThreshold] = useState(5000);

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

  // Create day-by-day mapping
  const daysList = useMemo(() => {
    const list = [];
    let currentDayNum = 1;

    tripStops.forEach((leg) => {
      const city = cities.find((c) => c.id === leg.cityId || c.name === leg.cityName);
      const cityName = city ? city.name : leg.cityName || 'Destination';
      const dailyCost = city ? city.avgDailyCost : 2500;
      const legDays = leg.days || 3;

      for (let d = 1; d <= legDays; d++) {
        list.push({
          dayNumber: currentDayNum,
          cityName,
          lodgingCost: dailyCost,
          legDay: d
        });
        currentDayNum++;
      }
    });

    if (list.length === 0) {
      for (let d = 1; d <= totalDays; d++) {
        list.push({
          dayNumber: d,
          cityName: 'Jaipur',
          lodgingCost: 2500,
          legDay: d
        });
      }
    }
    return list;
  }, [tripStops, cities, totalDays]);

  // Selected activities list
  const catalogActs = activities.filter((a) =>
    trip.selectedActivities?.includes(a.id)
  );
  const customActs = trip.customActivities || [];
  const allTripActivities = [...catalogActs, ...customActs];

  // Transport costs total
  const transportTotal = Object.values(trip.transportFares || {}).reduce(
    (sum, fare) => sum + Number(fare || 0),
    0
  );

  // Total Lodging Cost
  const lodgingTotal = daysList.reduce((sum, d) => sum + d.lodgingCost, 0);

  // Total Activities Cost
  const activitiesTotal = allTripActivities.reduce((sum, a) => sum + (a.cost || 0), 0);

  // Estimated Meals & Miscellaneous (Est ₹800 per day)
  const mealsTotal = totalDays * 800;

  // Grand Total Estimated Cost
  const grandTotalCost = lodgingTotal + activitiesTotal + transportTotal + mealsTotal;
  const targetBudget = trip.totalBudget || 35000;
  const avgCostPerDay = Math.round(grandTotalCost / totalDays);

  // Budget Status calculation
  const budgetRatio = grandTotalCost / targetBudget;
  let budgetStatus = { label: 'Under Budget', variant: 'emerald' };
  if (budgetRatio > 1.1) {
    budgetStatus = { label: 'Over Budget', variant: 'rose' };
  } else if (budgetRatio >= 0.9) {
    budgetStatus = { label: 'Near Target', variant: 'amber' };
  }

  // 1. Data for Category Pie Chart
  const categoryPieData = [
    { name: 'Stay & Lodging', value: lodgingTotal, color: CATEGORY_COLORS.Stay },
    { name: 'Scheduled Activities', value: activitiesTotal, color: CATEGORY_COLORS.Activities },
    { name: 'Transport Connections', value: transportTotal, color: CATEGORY_COLORS.Transport },
    { name: 'Meals & Misc (Est)', value: mealsTotal, color: CATEGORY_COLORS.Meals }
  ].filter((item) => item.value > 0);

  // 2. Data for Day-by-Day Bar Chart
  const dailyBarData = useMemo(() => {
    return daysList.map((day) => {
      const dayActs = allTripActivities.filter((a) => a.dayNumber === day.dayNumber);
      const dayActCost = dayActs.reduce((sum, a) => sum + (a.cost || 0), 0);
      const dayMealsCost = 800;
      const totalDaySpend = day.lodgingCost + dayActCost + dayMealsCost;

      return {
        dayLabel: `Day ${day.dayNumber}`,
        cityName: day.cityName,
        Stay: day.lodgingCost,
        Activities: dayActCost,
        Meals: dayMealsCost,
        totalDaySpend
      };
    });
  }, [daysList, allTripActivities]);

  // Highlight days exceeding configured daily threshold
  const exceedingDays = dailyBarData.filter(
    (d) => d.totalDaySpend > Number(dailyThreshold)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Top Prominent Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Estimated Cost */}
        <Card className="p-5 flex flex-col justify-between border-brand-200 bg-gradient-to-br from-brand-50/50 to-white shadow-warm-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Estimated Cost
            </span>
            <div className="p-2 rounded-xl bg-brand-500 text-white">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">
              ₹{grandTotalCost.toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Calculated across {totalDays} trip days
            </p>
          </div>
        </Card>

        {/* Target Budget & Health Status */}
        <Card className="p-5 flex flex-col justify-between border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Target Budget
            </span>
            <Badge variant={budgetStatus.variant}>{budgetStatus.label}</Badge>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">
              ₹{targetBudget.toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              {grandTotalCost <= targetBudget
                ? `₹${(targetBudget - grandTotalCost).toLocaleString()} buffer remaining`
                : `Exceeds budget target by ₹${(grandTotalCost - targetBudget).toLocaleString()}`}
            </p>
          </div>
        </Card>

        {/* Average Cost Per Day */}
        <Card className="p-5 flex flex-col justify-between border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Avg Spend per Day
            </span>
            <div className="p-2 rounded-xl bg-ocean-600 text-white">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">
              ₹{avgCostPerDay.toLocaleString()}
              <span className="text-xs font-bold text-slate-400">/day</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Includes stay, food & activities
            </p>
          </div>
        </Card>

        {/* Configurable Daily Budget Threshold Control */}
        <Card className="p-5 flex flex-col justify-between border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Daily Limit Threshold
            </span>
            <Sliders className="w-4 h-4 text-brand-500" />
          </div>
          <div className="mt-2 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-slate-700">₹</span>
              <input
                type="number"
                step="500"
                value={dailyThreshold}
                onChange={(e) => setDailyThreshold(e.target.value)}
                className="w-full px-2 py-1 text-sm font-extrabold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Alerts when daily spend exceeds limit
            </p>
          </div>
        </Card>
      </div>

      {/* Threshold Alert Banner */}
      {exceedingDays.length > 0 ? (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs flex-1">
            <h4 className="font-bold text-amber-900">
              Daily Budget Limit Alert ({exceedingDays.length} {exceedingDays.length === 1 ? 'Day' : 'Days'} Exceeded)
            </h4>
            <p className="mt-0.5 leading-relaxed text-amber-800">
              The following trip days exceed your configured daily limit of{' '}
              <span className="font-extrabold">₹{Number(dailyThreshold).toLocaleString()}</span>:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {exceedingDays.map((d) => (
                <span
                  key={d.dayLabel}
                  className="px-2.5 py-1 rounded-xl bg-amber-100/80 border border-amber-300 font-bold text-amber-900 text-[11px]"
                >
                  {d.dayLabel} ({d.cityName}) — ₹{d.totalDaySpend.toLocaleString()}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All trip days are within your configured daily threshold of ₹{Number(dailyThreshold).toLocaleString()}!</span>
        </div>
      )}

      {/* Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Cost Breakdown PieChart */}
        <Card className="lg:col-span-5 p-6 flex flex-col gap-4 border-slate-200/80">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-brand-500" />
              Category Cost Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Proportional distribution by expense type
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Summary List */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 text-xs">
            {categoryPieData.map((item) => {
              const pct = Math.round((item.value / grandTotalCost) * 100);
              return (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-medium text-slate-600">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="font-extrabold text-slate-900">
                    ₹{item.value.toLocaleString()}{' '}
                    <span className="text-[11px] font-normal text-slate-400">({pct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Cost Per Day BarChart */}
        <Card className="lg:col-span-7 p-6 flex flex-col gap-4 border-slate-200/80">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-500" />
              Day-by-Day Cost Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily expenditure with threshold reference line
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyBarData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dayLabel" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }} />
                <Tooltip
                  formatter={(value, name) => [`₹${value.toLocaleString()}`, name]}
                  contentStyle={{
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                <ReferenceLine
                  y={Number(dailyThreshold)}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{
                    value: `Limit: ₹${Number(dailyThreshold).toLocaleString()}`,
                    fill: '#ef4444',
                    fontSize: 10,
                    fontWeight: 'bold',
                    position: 'top'
                  }}
                />
                <Bar dataKey="Stay" stackId="a" fill={CATEGORY_COLORS.Stay} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Activities" stackId="a" fill={CATEGORY_COLORS.Activities} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Meals" stackId="a" fill={CATEGORY_COLORS.Meals} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
