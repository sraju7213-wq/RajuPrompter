import { AreaChart, BarChart3, Download, Gauge, PieChart, Share2 } from 'lucide-react';

const metrics = [
  {
    title: 'Prompt Effectiveness',
    value: '92%',
    description: 'Average increase in response quality after optimization.',
  },
  {
    title: 'Bias Mitigation',
    value: '98%',
    description: 'Prompts passing inclusive language & fairness checks.',
  },
  {
    title: 'Team Velocity',
    value: '3.2x',
    description: 'Faster iteration cycles with realtime collaboration.',
  },
];

const AnalyticsPanel = () => {
  return (
    <section id="analytics" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">Intelligence & Analytics</h2>
          <p className="text-sm text-slate-400">Track performance, conversions, and prompt experimentation.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <button className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1">
            <Download className="h-4 w-4" /> Export
          </button>
          <button className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1">
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.title} className="bento-card p-6">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg text-white">{metric.title}</p>
              <Gauge className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-3 text-3xl font-bold text-white">{metric.value}</p>
            <p className="mt-2 text-xs text-slate-400">{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bento-card col-span-2 p-6">
          <div className="flex items-center gap-3">
            <AreaChart className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-white">Prompt Quality Trend</p>
              <p className="text-xs text-slate-400">Rolling 30-day analysis across AI models.</p>
            </div>
          </div>
          <div className="mt-4 h-40 rounded-2xl border border-white/10 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
        </div>
        <div className="bento-card p-6">
          <div className="flex items-center gap-3">
            <PieChart className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-white">Platform Utilization</p>
              <p className="text-xs text-slate-400">Usage by creative teams this week.</p>
            </div>
          </div>
          <div className="mt-4 h-40 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/40 to-primary/30" />
        </div>
      </div>

      <div className="bento-card p-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-primary" />
          <div>
            <p className="font-semibold text-white">Conversion Impact</p>
            <p className="text-xs text-slate-400">Cross-channel uplift from optimized marketing prompts.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 text-xs text-slate-300 md:grid-cols-4">
          {['Email CTR +28%', 'Landing Conversion +34%', 'Social Engagement +62%', 'Sales Qualified Leads +18%'].map(
            (item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                {item}
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPanel;
