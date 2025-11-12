interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number | null;
  subtext?: string;
  linear?: string;
}

export default function StatsCard({
  icon,
  label,
  value,
  subtext,
  linear = "from-purple-500 to-pink-500",
}: StatsCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 sm:p-5 md:p-6 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br ${linear} rounded-lg flex items-center justify-center text-xl sm:text-2xl`}
        >
          {icon}
        </div>
      </div>
      <p className="text-gray-400 text-xs sm:text-sm mb-1">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-white mb-1 break-all">
        {value}
      </p>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </div>
  );
}
