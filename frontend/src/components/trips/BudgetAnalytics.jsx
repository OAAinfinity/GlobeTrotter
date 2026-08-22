import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  Compass,
  Sparkles
} from 'lucide-react';

export const BudgetAnalytics = ({ trip, cities, activities }) => {
  if (!trip) return null;

  const targetBudget = Number(trip.totalBudget) || 35000;

  // Selected activities cost
  const selectedActivitiesList = activities.filter((a) =>
    trip.selectedActivities?.includes(a.id)
  );

  const activitiesTotal = selectedActivitiesList.reduce(
    (sum, a) => sum + (a.cost || 0),
    0
  );

  // Estimate lodging and daily expenses
  const lodgingTotal = (trip.cities || []).reduce((sum, leg) => {
    const city = cities.find((c) => c.id === leg.cityId);
    const daily = city ? city.avgDailyCost : 2500;
    return sum + daily * leg.days;
  }, 0);

  // Buffer for local transport & meals (approx 25% of lodging daily)
  const transportTotal = Math.round(lodgingTotal * 0.25);

  const totalEstimatedCost = activitiesTotal + lodgingTotal + transportTotal;
  const remainingBudget = targetBudget - totalEstimatedCost;
  const percentageUsed = Math.min(
    100,
    Math.round((totalEstimatedCost / targetBudget) * 100)
  );

  const budgetHealth =
    totalEstimatedCost > targetBudget
      ? 'over'
      : percentageUsed > 85
      ? 'near'
      : 'under';

  return (
    <div className="flex flex-col gap-6">
      {/* Top Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hoverEffect={false} className="flex flex-col gap-1 border-slate-200/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Target Budget
          </span>
          <span className="text-2xl font-extrabold text-slate-900 flex items-center gap-0.5">
            ₹{targetBudget.toLocaleString()}
          </span>
        </Card>

        <Card hoverEffect={false} className="flex flex-col gap-1 border-slate-200/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Estimated Cost
          </span>
          <span
            className={`text-2xl font-extrabold flex items-center gap-0.5 ${
              budgetHealth === 'over'
                ? 'text-rose-600'
                : budgetHealth === 'near'
                ? 'text-amber-600'
                : 'text-emerald-600'
            }`}
          >
            ₹{totalEstimatedCost.toLocaleString()}
          </span>
        </Card>

        <Card hoverEffect={false} className="flex flex-col gap-1 border-slate-200/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Budget Health
          </span>
          <div className="flex items-center gap-2 mt-1">
            {budgetHealth === 'under' && (
              <Badge variant="emerald" icon={CheckCircle2}>
                Under Budget (₹{Math.abs(remainingBudget).toLocaleString()} left)
              </Badge>
            )}
            {budgetHealth === 'near' && (
              <Badge variant="amber" icon={AlertTriangle}>
                Near Target (₹{Math.abs(remainingBudget).toLocaleString()} left)
              </Badge>
            )}
            {budgetHealth === 'over' && (
              <Badge variant="rose" icon={AlertTriangle}>
                Over Budget (₹{Math.abs(remainingBudget).toLocaleString()} over)
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {/* Progress Bar & Meter */}
      <Card hoverEffect={false} className="p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <PieChart className="w-4 h-4 text-brand-500" />
            <span>Budget Utilization Gauge</span>
          </div>
          <span className="text-xs font-extrabold text-slate-700">
            {percentageUsed}% of ₹{targetBudget.toLocaleString()} Used
          </span>
        </div>

        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budgetHealth === 'over'
                ? 'bg-rose-500'
                : budgetHealth === 'near'
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${percentageUsed}%` }}
          />
        </div>

        {/* Detailed Expense Category Stack */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-100 flex flex-col gap-1">
            <div className="flex items-center justify-between text-brand-900 font-bold">
              <span>Selected Activities</span>
              <span>₹{activitiesTotal.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-brand-700">
              {selectedActivitiesList.length} scheduled experiences
            </p>
          </div>

          <div className="p-3 bg-ocean-50/60 rounded-xl border border-ocean-100 flex flex-col gap-1">
            <div className="flex items-center justify-between text-ocean-900 font-bold">
              <span>Lodging & Daily Base</span>
              <span>₹{lodgingTotal.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-ocean-700">
              Based on Indian city average daily rates
            </p>
          </div>

          <div className="p-3 bg-sand-100 rounded-xl border border-slate-200/80 flex flex-col gap-1">
            <div className="flex items-center justify-between text-slate-900 font-bold">
              <span>Local Transit & Meals</span>
              <span>₹{transportTotal.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Estimated 25% buffer for auto/taxis & meals
            </p>
          </div>
        </div>
      </Card>

      {/* Budget Tips Card */}
      <Card hoverEffect={false} className="bg-gradient-to-r from-amber-50/80 to-brand-50/80 border-amber-200/70 p-5 flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Smart India Traveler Tip</h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {budgetHealth === 'over'
              ? 'Your estimated trip total exceeds your target budget. Try opting for heritage walking tours, public sleeper trains, or adjusting stay durations.'
              : 'You are within your budget threshold! Consider reserving an extra ₹2,000–₹3,000 buffer for local handicraft shopping or special royal dinner thalis.'}
          </p>
        </div>
      </Card>
    </div>
  );
};
