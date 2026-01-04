import { Spinner } from "../Loading";

type columns = {
  label: string;
  value: string;
};

type TableProps = {
  title: string;
  isLoading?: boolean;
  columns: columns[];
  data: any[];
};

export const Table = ({ columns, data, title, isLoading }: TableProps) => {
  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded p-4 shadow-lg">
      {/* TITLE */}
      <h3 className="mb-4 font-bold">{title}</h3>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-auto">
          <thead>
            <tr className="text-left text-xs">
              {columns.map((c) => (
                <th key={c.value} className="px-2 py-2">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((d) => (
              <tr key={d.id} className="bg-white">
                {columns.map((c) => (
                  <td key={c.value} className="px-2 py-3">
                    {d[c.value]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
