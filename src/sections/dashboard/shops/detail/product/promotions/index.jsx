import { LoadingOutlined } from '@ant-design/icons';
import { TabContext, TabPanel } from '@mui/lab';
import { Button, Card, Tab, Tabs } from '@mui/material';
import { Row, Col, Select, Input, Table, Tag, Spin } from 'antd';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDebounce } from 'src/hooks/useDebounce';
import { RepositoryRemote } from 'src/services';
import { usePromotionsStore } from 'src/store/promotionsStore';

const { Search } = Input;

export const Promotion = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [tab, setTab] = useState('1');
  const [promotionsData, setPromotionsData] = useState([]);
  const [refreshPromotion, setRefreshPromotion] = useState(false);
  const [promotionSelected, setPromotionSelected] = useState([]);
  const { InactivePromotion, loading } = usePromotionsStore((state) => state);

  const debouncedSearchValue = useDebounce(searchValue, 1000);

  const rowSelection = {
    onChange: (_, selectedRows) => {
      const dataSelect = selectedRows.map((item) => item.promotion_id);
      setPromotionSelected(dataSelect);
    },
    getCheckboxProps: (record) => ({
      disabled: record.status.props.children !== 'Ongoing',
    }),
  };

  const columns = [
    {
      title: 'Promotion name',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => <Link href={`/shops/${shopId}/promotions/${record.promotion_id}`}>{record.title}</Link>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Start time(PST)',
      dataIndex: 'begin_time',
      key: 'begin_time',
    },
    {
      title: 'End time(PST)',
      dataIndex: 'end_time',
      key: 'end_time',
    },
    {
      title: 'Type',
      dataIndex: 'promotion_type',
      key: 'promotion_type',
    },
  ];

  const handleInactivePromotion = () => {
    const dataSubmit = {
      promotion_ids: promotionSelected,
    };

    const onSuccess = (res) => {
      if (res) {
        // console.log('res: ', res);
        setPromotionSelected([]);
        setRefreshPromotion(true);
        toast.success('res.map((item) => `Dừng ${item} thành công`');
      }
    };

    InactivePromotion(shopId, dataSubmit, onSuccess, () => {});
  };

  const renderStatusPromotion = (record) => {
    if (record.status === 1) {
      return <Tag color="processing">Upcoming</Tag>;
    }
    if (record.status === 2) {
      return <Tag color="success">Ongoing</Tag>;
    }
    if (record.status === 3) {
      return <Tag color="error">Expired</Tag>;
    }
    return <Tag color="default">Deactivated</Tag>;
  };

  const fetchPromotions = async () => {
    const { data } = await RepositoryRemote.promotions.requestGetPromotions(shopId, 1, searchValue, filterStatus);
    if (data.success === false) {
      alerts.error(data.message);

      return;
    }

    const promotions = data.promotion_list.map((promotion) => {
      return {
        ...promotion,
        begin_time: new Date(promotion.begin_time * 1000).toLocaleString({
          timeZone: 'America/Los_Angeles',
        }),
        end_time: new Date(promotion.end_time * 1000).toLocaleString({
          timeZone: 'America/Los_Angeles',
        }),
        promotion_type: promotion.promotion_type === 3 ? 'Flash sale' : 'Discount',
        status: renderStatusPromotion(promotion),
      };
    });

    setPromotionsData(promotions);
  };

  useEffect(() => {
    fetchPromotions();
  }, [debouncedSearchValue, filterStatus, refreshPromotion]);

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Card className="p-4 !font-sora">
      {/* <Tabs className="w-full" defaultActiveKey="1" items={items} /> */}
      <TabContext value={tab}>
        <Tabs value={tab} onChange={handleChangeTab}>
          <Tab value="1" label="Quản lý khuyến mãi" className="!px-3" />
          <Tab value="2" label="Tạo chương trình khuyến mãi" className="!px-3" />
        </Tabs>
        <TabPanel value="1" className="!px-0">
          <Card className="w-full p-4">
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <div className="lg:w-[calc(100%/3)]">
                <Select
                  size="large"
                  defaultValue="all"
                  style={{
                    width: '90%',
                  }}
                  onChange={(value) => setFilterStatus(value)}
                  options={[
                    {
                      value: 'all',
                      label: 'All statuses',
                    },
                    {
                      label: 'Upcoming',
                      value: '1',
                    },
                    {
                      label: 'Ongoing',
                      value: '2',
                    },
                    {
                      value: '3',
                      label: 'Expired',
                    },
                    {
                      value: '4',
                      label: 'Deactivated',
                    },
                  ]}
                />
              </div>
              <div className="lg:flex-1">
                <Search
                  size="large"
                  placeholder="Enter promotion name"
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <Button variant="contained" disabled={!promotionSelected.length} onClick={handleInactivePromotion}>
                Stop promotion ({promotionSelected?.length || '0'})
                {promotionSelected.length > 0 && loading && (
                  <Spin indicator={<LoadingOutlined className="text-white ml-3" />} />
                )}
              </Button>
            </div>
            <div className="mt-8">
              <Table
                columns={columns}
                dataSource={promotionsData}
                bordered
                pagination={{ pageSize: 30 }}
                rowSelection={{
                  type: 'checkbox',
                  selectedRowKeys: promotionSelected,
                  ...rowSelection,
                }}
                rowKey={(record) => record.promotion_id}
                loading={loading}
              />
            </div>
          </Card>
        </TabPanel>
        <TabPanel value="2" className="!px-0">
          <Card className="w-full p-4">
            <Row gutter={[30, 30]}>
              <Col md={{ span: 12 }} span={24} className="cursor-pointer">
                <Card className="p-6">
                  <h2 className="text-base font-semibold">Product discount</h2>
                  <p className="h-6 overflow-hidden text-ellipsis">
                    Set daily discounts to generate interest and boost sales.
                  </p>
                  <div className="mt-4">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => router.push(`/shops/${shopId}/promotions/discounts`)}
                    >
                      Create
                    </Button>
                  </div>
                </Card>
              </Col>

              <Col md={{ span: 12 }} span={24} className="cursor-pointer">
                <Card className="p-6">
                  <h2 className="text-base font-semibold">Flash Deal</h2>
                  <p className="h-6 overflow-hidden text-ellipsis">
                    Offer limited-time deals to incentivize swift purchases, sell excess inventory or attract new
                    buyers.
                  </p>
                  <div className="mt-4">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => router.push(`/shops/${shopId}/promotions/flash-deal`)}
                    >
                      Create
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </TabPanel>
      </TabContext>
    </Card>
  );
};
