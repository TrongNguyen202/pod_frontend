import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, MenuItem, Select } from '@mui/material';
import { useAppSelector } from 'src/redux/hook';
import { useEffect, useMemo, useState } from 'react';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';

export const ChartOrder = ({ optionShop }) => {
  const { order } = useAppSelector((state) => state.statistics);
  const { shops } = useAppSelector((state) => state.shops);
  const [shopId, setShopId] = useState(shops[0]?.id || null);
  const [dataStatus, setDataStatus] = useState([]);
  const [dataAllShop, setDataAllShop] = useState([]);
  const [dataOneShop, setDataOneShop] = useState([]);

  const handleData = () => {
    if (order?.data?.length) {
      const status = order.data
        .map((data) => {
          return {
            date: data.date,
            unPair: data.orders.status.UNPAID || 0,
            onHold: data.orders.status.ON_HOLD || 0,
            partiallyShipping: data.orders.status.PARTIALLY_SHIPPING || 0,
            awaitingShipment: data.orders.status.AWAITING_SHIPMENT || 0,
            awaitingCollection: data.orders.status.AWAITING_COLLECTION || 0,
            inTransit: data.orders.status.IN_TRANSIT || 0,
            delivered: data.orders.status.DELIVERED || 0,
            completed: data.orders.status.COMPLETED || 0,
            cancelled: data.orders.status.CANCELLED || 0,
            total: data.orders.status.TOTAL || 0,
          };
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const allShop = order.data
        .map((data) => {
          return {
            date: data.date,
            'Tổng đơn hàng': data.orders.shops.reduce((sum, item) => sum + item.status.TOTAL, 0),
          };
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setDataStatus(status);
      setDataAllShop(allShop);
    }
  };

  useEffect(() => {
    if (order?.data?.length) {
      const oneShop = order.data
        .map((data) => {
          const shop = data.orders.shops.filter((item) => item.shop_id === shopId.toString());
          return {
            date: data.date,
            ...(shop.length
              ? {
                  unPair: shop[0]?.status?.UNPAID || 0,
                  onHold: shop[0]?.status?.ON_HOLD || 0,
                  partiallyShipping: shop[0]?.status?.PARTIALLY_SHIPPING || 0,
                  awaitingShipment: shop[0]?.status?.AWAITING_SHIPMENT || 0,
                  awaitingCollection: shop[0]?.status?.AWAITING_COLLECTION || 0,
                  inTransit: shop[0]?.status?.IN_TRANSIT || 0,
                  delivered: shop[0]?.status?.DELIVERED || 0,
                  completed: shop[0]?.status?.COMPLETED || 0,
                  cancelled: shop[0]?.status?.CANCELLED || 0,
                  total: shop[0]?.status?.TOTAL || 0,
                }
              : {
                  unPair: 0,
                  onHold: 0,
                  partiallyShipping: 0,
                  awaitingShipment: 0,
                  awaitingCollection: 0,
                  inTransit: 0,
                  delivered: 0,
                  completed: 0,
                  cancelled: 0,
                  total: 0,
                }),
          };
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      setDataOneShop(oneShop);
    }
  }, [order, shopId]);

  useEffect(() => {
    handleData();
  }, [order]);

  const selectOptionShop = useMemo(() => {
    if (optionShop.length && order?.data) {
      const listShop = optionShop.filter((item) => {
        return order?.data?.find((order) =>
          order?.orders?.shops?.find((shop) => String(shop?.shop_id) === String(item?.value)),
        );
      });
      setShopId(listShop[0]?.value);
      return listShop;
    }
    return [];
  }, [optionShop, order?.data]);

  return (
    <>
      <Card>
        <CardHeader title="Biểu đồ tổng toàn bộ đơn hàng" sx={{ pb: 0, pt: 2 }} />
        <ResponsiveContainer minHeight={360}>
          <LineChart data={dataAllShop}>
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
              angle={-35}
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
              dataKey="Tổng đơn hàng"
              label={'Total'}
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ fill: '#6366F1' }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <CardHeader title="Biểu đồ đơn hàng theo trạng thái" sx={{ pb: 0, pt: 2 }} />
        <ResponsiveContainer height={400}>
          <BarChart
            data={dataStatus}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barGap={0}
            barCategoryGap="10%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-35} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip
              wrapperStyle={{
                border: 'none',
                boxShadow: '4px 4px 40px rgba(0, 0, 0, 0.05)',
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '10px',
                fontSize: 14,
              }}
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
            <Legend />
            <Bar dataKey="total" fill="#6366F1" name="Total" />
            <Bar dataKey="completed" fill="#2E7D32" name="Completed" />
            <Bar dataKey="onHold" fill="#DADBDE" name="On Hold" />
            <Bar dataKey="delivered" fill="#0288D1" name="Delivered" />
            <Bar dataKey="inTransit" fill="#9C27B0" name="In Transit" />
            <Bar dataKey="partiallyShipping" fill="rgb(205, 173, 0)" name="Partially Shipping" />
            <Bar dataKey="awaitingCollection" fill="#1976D2" name="Await Collection" />
            <Bar dataKey="awaitingShipment" fill="#ED6C02" name="Awaiting Shipment" />
            <Bar dataKey="unPair" fill="#D32F2F" name="Un Paid" />
            <Bar dataKey="cancelled" fill="#D32F2F" name="Cancelled" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <CardHeader title="Biểu đồ đơn hàng theo trạng thái của cửa hàng" sx={{ pb: 0, pt: 2 }} />
        <Stack direction="row" className="px-5 pt-2">
          <Select value={shopId} onChange={(e) => setShopId(e.target.value)} className="w-[250px]">
            {selectOptionShop.map((shop) => {
              return (
                <MenuItem key={shop.value} value={shop.value}>
                  {shop.value} | {shop.title}
                </MenuItem>
              );
            })}
          </Select>
        </Stack>
        <ResponsiveContainer height={400}>
          <BarChart
            data={dataOneShop}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barGap={0}
            barCategoryGap="10%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-35} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip
              wrapperStyle={{
                border: 'none',
                boxShadow: '4px 4px 40px rgba(0, 0, 0, 0.05)',
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '10px',
                fontSize: 14,
              }}
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
            <Legend />
            <Bar dataKey="total" fill="#6366F1" name="Total" />
            <Bar dataKey="completed" fill="#2E7D32" name="Completed" />
            <Bar dataKey="onHold" fill="#DADBDE" name="On Hold" />
            <Bar dataKey="delivered" fill="#0288D1" name="Delivered" />
            <Bar dataKey="inTransit" fill="#9C27B0" name="In Transit" />
            <Bar dataKey="partiallyShipping" fill="rgb(205, 173, 0)" name="Partially Shipping" />
            <Bar dataKey="awaitingCollection" fill="#1976D2" name="Await Collection" />
            <Bar dataKey="awaitingShipment" fill="#ED6C02" name="Awaiting Shipment" />
            <Bar dataKey="unPair" fill="#D32F2F" name="Un Paid" />
            <Bar dataKey="cancelled" fill="#D32F2F" name="Cancelled" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
};
