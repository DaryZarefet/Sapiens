type Kpi = {
  title: string;
  value: number;
  delta?: string;
};

export function KpiCard({ title, value, delta }: Kpi) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <dt className="text-sm font-medium text-gray-500">{title}</dt>
      <dd className="mt-1 flex items-baseline gap-2">
        <div className="text-2xl font-semibold text-gray-900">${value}</div>
        {delta && <span className={`text-sm ${delta.startsWith("-") ? "text-red-500" : "text-green-600"}`}>{delta}</span>}
      </dd>
    </div>
  );
}
