import { FinanceStatistics } from './finance';
import { useState } from 'react';
import Tab from '@mui/material/Tab';
import { TabContext, TabPanel } from '@mui/lab';
import Tabs from '@mui/material/Tabs';
import { OrderStatistics } from './order';

export const OverviewPage = () => {
  const [tab, setTab] = useState('1');
  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };
  return (
    <TabContext value={tab}>
      <Tabs value={tab} onChange={handleChangeTab}>
        <Tab value="1" label="Doanh Thu" />
        <Tab value="2" label="Đơn & Sản phẩm" />
      </Tabs>
      <TabPanel value="1">
        <FinanceStatistics />
      </TabPanel>
      <TabPanel value="2">
        <OrderStatistics />
      </TabPanel>
    </TabContext>
  );
};
