import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

import GroupsIcon            from '@mui/icons-material/Groups';
import AttachMoneyIcon       from '@mui/icons-material/AttachMoney';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import ShowChartIcon         from '@mui/icons-material/ShowChart';

const stats = [
  {
    title: 'Tổng người dùng',
    value: '2.847',
    diff: '+12.5% so với tháng trước',
    icon: GroupsIcon,
    circle: 'bg-blue-100 text-blue-500',
  },
  {
    title: 'Doanh thu tổng',
    value: '125.600.000 ₫',
    diff: '+8.2% so với tháng trước',
    icon: AttachMoneyIcon,
    circle: 'bg-green-100 text-green-600',
  },
  {
    title: 'Boards đang hoạt động',
    value: '342',
    diff: '+15.3% so với tháng trước',
    icon: DashboardCustomizeIcon,
    circle: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Giao dịch hôm nay',
    value: '89',
    diff: '',
    icon: ShowChartIcon,
    circle: 'bg-orange-100 text-orange-600',
  },
];

export default function AdminDashboard() {
  return (
    <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {stats.map(({ title, value, diff, icon: Icon, circle }) => (
        <Card
          key={title}
          elevation={0}
          className="border border-gray-100 shadow-sm transition-transform duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <CardContent className="flex items-center justify-between p-6">
            {/* Nội dung bên trái */}
            <Box>
              <Typography variant="body2" className="text-gray-500">
                {title}
              </Typography>

              <Typography variant="h4" className="my-1 font-bold">
                {value}
              </Typography>

              {diff && (
                <Typography variant="body2" className="text-green-600">
                  {diff}
                </Typography>
              )}
            </Box>

            {/* Icon bên phải */}
            <Box
              className={`w-14 h-14 flex items-center justify-center rounded-full ${circle}`}
            >
              <Icon fontSize="medium" />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

