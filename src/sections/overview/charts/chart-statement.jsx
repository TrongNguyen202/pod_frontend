import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAppSelector } from 'src/redux/hook';
import CardHeader from '@mui/material/CardHeader';

export const ChartStatement = () => {
  const { finance } = useAppSelector((state) => state.statistics);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (finance?.data?.length) {
      const result = finance.data
        .map((finance) => {
          return {
            date: finance.date,
            Total: finance?.statements?.status?.TOTAL?.revenue_amount || 0,
            Processing: finance?.statements?.status?.PROCESSING?.revenue_amount || 0,
            Paid: finance?.statements?.status?.PAID?.revenue_amount || 0,
          };
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      setData([...result]);
    } else {
      setData([]);
    }
  }, [finance]);

  return (
    <Card>
      <CardHeader title="Biểu đồ doanh thu theo trạng thái đơn hàng" sx={{ pb: 0, pt: 2 }} />
      <ResponsiveContainer height={400}>
        <LineChart data={data}>
          <Legend
            verticalAlign="top"
            // eslint-disable-next-line react/no-unstable-nested-components
            content={(prop) => {
              const { payload } = prop;
              return (
                <ul className="text-right text-[#999] text-[14px]">
                  {payload.map((item, key) => (
                    <li key={key} className="h-[48px] line-clamp-[48px] inline-block ml-[24px]">
                      <span
                        // className={styles.radiusdot}
                        className="w-[12px] h-[12px] mr-[8px] rounded-[50%] inline-block"
                        style={{ background: item.color }}
                      />
                      {item.value}
                    </li>
                  ))}
                </ul>
              );
            }}
          />
          <XAxis
            dataKey="date"
            axisLine={{ stroke: '#e5e5e5', strokeWidth: 1 }}
            tickLine={true}
            // angle={-35}
            textAnchor="end"
            height={100}
            dx={30}
          />
          <YAxis axisLine={false} tickLine={false} />
          <CartesianGrid vertical={false} stroke="#e5e5e5" strokeDasharray="3 3" />
          <Tooltip
            wrapperStyle={{
              border: 'none',
              boxShadow: '4px 4px 40px rgba(0, 0, 0, 0.05)',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '10px',
              fontSize: 14,
            }}
            // eslint-disable-next-line react/no-unstable-nested-components
            content={(content) => {
              const list = content.payload.map((item, key) => (
                <li key={key} className="flex items-center">
                  <span
                    className="w-[12px] h-[12px] mr-[8px] rounded-[50%] inline-block my-[10px]"
                    style={{ background: item.color }}
                  />
                  {`${item.name}: ${item.value}`}
                </li>
              ));
              return (
                <div>
                  <p className="font-medium">{content.label}</p>
                  {content.payload && <ul>{list}</ul>}
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="Total"
            label={'Total'}
            stroke="#1976D2"
            strokeWidth={3}
            dot={{ fill: '#1976D2' }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="Processing"
            label={'Processing'}
            stroke="#ED6C02"
            strokeWidth={3}
            dot={{ fill: '#ED6C02' }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="Paid"
            label={'Paid'}
            stroke="#2E7D32"
            strokeWidth={3}
            dot={{ fill: '#2E7D32' }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
