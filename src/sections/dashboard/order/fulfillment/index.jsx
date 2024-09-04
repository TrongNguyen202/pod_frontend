import { Box, Button, Card, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { usePageView } from 'src/hooks/use-page-view';
import { useAppDispatch } from 'src/redux/hook';
import { OrderLabelComponent } from './order-label';
import { useSelection } from 'src/hooks/use-selection';
import { OrderCheckDesign } from './order-check-design';
import { OrderCheckPartner } from './order-for-partner';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { RepositoryRemote } from 'src/services';

export const PageFulfillment = () => {
  usePageView();
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(0);
  const [enableNextStep, setEnableNextStep] = useState(false);
  const [toShipInfoData, setToShipInfoData] = useState([]);
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');
  const [dataConvert, setDataConvert] = useState([]);

  const orderIds = useMemo(() => {
    if (dataConvert?.length) {
      return dataConvert?.map((data) => data?.package_id);
    }
    return [];
  }, [dataConvert]);

  useEffect(() => {
    if (shopId) {
      const data = sessionStorage.getItem(`fulfillment_${shopId}`);
      if (data) {
        setDataConvert(JSON.parse(data));
      } else {
        setDataConvert([]);
      }
    }
  }, [shopId]);

  const ordersSelection = useSelection(orderIds);

  const changeNextStep = (value) => {
    setEnableNextStep(value);
  };

  const handleNextSteps = () => {
    setCurrent(current + 1);
  };

  const handlePreSteps = () => {
    setCurrent(current - 1);
  };

  const getToShipInfo = (data) => {
    setToShipInfoData(data);
  };

  const isStepFailed = (step) => {
    return step === 9;
  };

  const steps = [
    {
      title: 'Danh sách Label đã mua',
      content: (
        <OrderLabelComponent
          changeNextStep={changeNextStep}
          toShipInfoData={getToShipInfo}
          items={dataConvert}
          onDeselectAll={ordersSelection.handleDeselectAll}
          onDeselectOne={ordersSelection.handleDeselectOne}
          onSelectAll={ordersSelection.handleSelectAll}
          onSelectOne={ordersSelection.handleSelectOne}
          selected={ordersSelection.selected}
        />
      ),
    },
    {
      title: 'Kiểm tra và xử lý Design',
      content: <OrderCheckDesign toShipInfoData={dataConvert} />,
    },
    {
      title: 'Xử lý và tạo đơn hàng',
      content: <OrderCheckPartner toShipInfoData={toShipInfoData} />,
    },
  ];

  const handlePushToDriver = async (data) => {
    try {
      const dataLabelProcess = {
        order_documents: data?.map((item) => ({
          package_id: item.package_id,
          doc_url: item.label,
        })),
      };

      await RepositoryRemote.orders.requestUploadLabelToDriver(dataLabelProcess);
      toast.success('Đã đẩy label lên Server thành công.');
    } catch (error) {
      toast.error('Đẩy label lên Server thất bại. Thử lại sau!');
    }
  };

  useEffect(() => {
    // TODO: Open
    // handlePushToDriver(dataConvert);
  }, [dataConvert]);

  return (
    <Card>
      <Box className={'p-4'}>
        <Stepper activeStep={current}>
          {steps.map((step, index) => {
            const labelProps = {};
            if (isStepFailed(index)) {
              labelProps.optional = (
                <Typography variant="caption" color="error">
                  Alert message
                </Typography>
              );

              labelProps.error = true;
            }

            return (
              <Step key={step.title}>
                <StepLabel {...labelProps}>{step.title}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <Box className="flex my-5 gap-3">
          {current < steps.length - 1 && (
            <Button size="small" variant="contained" disabled={!enableNextStep} onClick={handleNextSteps}>
              Bước tiếp theo
            </Button>
          )}
          {current > 0 && (
            <Button size="small" variant="contained" onClick={handlePreSteps}>
              Quay lại
            </Button>
          )}
        </Box>
        <Box>{steps[current].content}</Box>
      </Box>
    </Card>
  );
};
