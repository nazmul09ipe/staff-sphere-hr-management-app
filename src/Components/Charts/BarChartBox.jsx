import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const BarChartBox = ({ data, showLabels = false }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />

          <Tooltip
            formatter={(value) => `$${Number(value).toLocaleString()}`}
          />

          <Bar
            dataKey="value"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
          >
            {showLabels && (
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value) =>
                  `$${Number(value).toLocaleString()}`
                }
                className="text-xs fill-gray-700 dark:fill-gray-200"
              />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartBox;