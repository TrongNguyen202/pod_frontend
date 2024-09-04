import { Card, Typography } from '@mui/material';
import Link from 'next/link';

export const CardOrder = (props) => {
  const { title, count, link } = props;

  return (
    <Card className="p-5">
      <Typography variant="h6" className="flex gap-1">
        {title}&nbsp;
        {count && <Typography className="">{count}</Typography>}
      </Typography>
      {link && (
        <Link href={link} className="text-[#1772c9] hover:underline">
          Xem thêm
        </Link>
      )}
    </Card>
  );
};
