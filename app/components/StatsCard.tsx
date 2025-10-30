interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number | null;
  subtext?: string;
  gradient?: string;
}

export default function StatsCard({
  icon,
  label,
  value,
  subtext,
  gradient = "from-purple-500 to-pink-500",
}: StatsCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </div>
  );
}
