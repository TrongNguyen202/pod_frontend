import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { CreateLabelTable } from './table';
import { usePageView } from 'src/hooks/use-page-view';
import { useSearchParams } from 'next/navigation';
import { CreateLabelTableAntd } from './table-antd';

export const PageCreateLabel = () => {
  usePageView();
  const [tableData, setTableData] = useState([]);
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');

  useEffect(() => {
    const data = sessionStorage.getItem(`create_label_${shopId}`);
    if (data) {
      setTableData(JSON.parse(data));
    } else {
      setTableData([]);
    }
  }, [shopId]);

  return (
    <Card>
      {/* <CreateLabelTable items={tableData} /> */}
      <CreateLabelTableAntd dataCombine={tableData} />
    </Card>
  );
};
