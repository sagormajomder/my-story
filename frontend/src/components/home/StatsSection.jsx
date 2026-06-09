import { Users, FileText, Eye, TrendingUp } from 'lucide-react';

const stats = [
  { icon: FileText, label: 'Stories Published', value: '500+', color: 'text-violet-500', bg: 'bg-violet-50' },
  { icon: Users, label: 'Active Writers', value: '200+', color: 'text-pink-500', bg: 'bg-pink-50' },
  { icon: Eye, label: 'Monthly Readers', value: '10K+', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: TrendingUp, label: 'Stories This Month', value: '80+', color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export default function StatsSection() {
  return (
    <section className="py-16 border-y border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, label, value, color, bg }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <div className={`${bg} ${color} p-3 rounded-xl mb-4`}>
                <Icon size={22} />
              </div>
              <span className="text-3xl font-bold mb-1">{value}</span>
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
